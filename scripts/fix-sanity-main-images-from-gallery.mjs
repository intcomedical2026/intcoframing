import { createClient } from "@sanity/client";
import fs from "node:fs/promises";
import path from "node:path";
import { loadEnvFile, parseArgs, requireToken, sanityConfigFromEnv } from "./sanity-env.mjs";

await loadEnvFile(".env.local");

const args = parseArgs(process.argv.slice(2));
const dryRun = Boolean(args.dryRun);
const language = args.language || "en";
const types = String(args.types || "product,blogPost,project")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const config = sanityConfigFromEnv(args);
const token = dryRun
  ? process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_TOKEN
  : requireToken(process.env.SANITY_API_TOKEN, "SANITY_API_TOKEN");
const reportPath = path.resolve(args.report || `reports/launch/sanity-main-image-fix-${dryRun ? "dry-run" : config.dataset}-${timestamp()}.json`);

const client = createClient({
  ...config,
  token,
  useCdn: false,
});

const docs = await client.fetch(
  /* groq */ `*[
    _type in $types &&
    coalesce(language, "en") == $language &&
    !(_id in path("drafts.**"))
  ]{
    _id,
    _type,
    title,
    path,
    "imageRef": image.asset._ref,
    "imageUrl": image.asset->url,
    "imageWidth": image.asset->metadata.dimensions.width,
    "imageHeight": image.asset->metadata.dimensions.height,
    gallery[]{
      _type,
      asset,
      crop,
      hotspot,
      "assetRef": asset._ref,
      "url": asset->url,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    }
  }`,
  { types, language },
);

const imageRefCountsByType = new Map();
for (const doc of docs) {
  if (!doc.imageRef) continue;
  const counts = imageRefCountsByType.get(doc._type) || new Map();
  counts.set(doc.imageRef, (counts.get(doc.imageRef) || 0) + 1);
  imageRefCountsByType.set(doc._type, counts);
}

const plans = [];
const skipped = [];
const candidateRefCountsByType = buildCandidateRefCountsByType(docs);
const assignedRefsByType = buildAssignedRefsByType(docs, imageRefCountsByType);
const duplicateGroupKeepersByType = buildDuplicateGroupKeepersByType(docs, imageRefCountsByType);

for (const doc of docs) {
  const currentCount = imageRefCountsByType.get(doc._type)?.get(doc.imageRef) || 0;
  if (!doc.imageRef || currentCount <= 1) {
    skipped.push(skip(doc, "current image is already unique"));
    continue;
  }

  const keeperId = duplicateGroupKeepersByType.get(doc._type)?.get(doc.imageRef);
  if (keeperId === doc._id && !isBannerLike({ width: doc.imageWidth, height: doc.imageHeight })) {
    assignedRefsByType.get(doc._type)?.add(doc.imageRef);
    skipped.push(skip(doc, "kept one item from duplicate group"));
    continue;
  }

  const gallery = Array.isArray(doc.gallery) ? doc.gallery.filter((item) => item?.assetRef) : [];
  if (!gallery.length) {
    skipped.push(skip(doc, "no gallery images"));
    continue;
  }

  const assignedRefs = assignedRefsByType.get(doc._type) || new Set();
  const selected = selectMainImageCandidate(doc, gallery, candidateRefCountsByType.get(doc._type) || new Map(), assignedRefs);
  if (!selected) {
    skipped.push(skip(doc, "no non-banner gallery candidate"));
    continue;
  }
  assignedRefs.add(selected.assetRef);

  plans.push({
    id: doc._id,
    type: doc._type,
    title: doc.title,
    path: doc.path,
    fromRef: doc.imageRef,
    fromUrl: doc.imageUrl,
    toRef: selected.assetRef,
    toUrl: selected.url,
    candidateIndex: selected.index,
    currentDuplicateCount: currentCount,
    patch: {
      image: toImageValue(selected),
    },
  });
}

if (!dryRun) {
  let patched = 0;
  for (const plan of plans) {
    await client.patch(plan.id).set(plan.patch).commit({ autoGenerateArrayKeys: true });
    patched += 1;
    if (patched % 25 === 0 || patched === plans.length) {
      console.log(`Patched ${patched}/${plans.length}`);
    }
  }
}

const after = dryRun ? null : await summarizeCurrentState();
const report = {
  ...config,
  dryRun,
  language,
  types,
  documentsChecked: docs.length,
  plannedPatches: plans.length,
  skipped: skipped.length,
  plannedByType: countBy(plans, "type"),
  skippedByReason: countBy(skipped, "reason"),
  before: summarizeDocs(docs),
  after,
  plans: plans.map((plan) => ({
    id: plan.id,
    type: plan.type,
    title: plan.title,
    path: plan.path,
    fromRef: plan.fromRef,
    fromUrl: plan.fromUrl,
    toRef: plan.toRef,
    toUrl: plan.toUrl,
    candidateIndex: plan.candidateIndex,
    currentDuplicateCount: plan.currentDuplicateCount,
  })),
  skippedSamples: skipped.slice(0, 50),
};

await fs.mkdir(path.dirname(reportPath), { recursive: true });
await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);

console.log(`${dryRun ? "Dry run" : "Main image fix"} complete.`);
console.log(`Documents checked: ${docs.length}`);
console.log(`Planned patches: ${plans.length}`);
console.log(`Skipped: ${skipped.length}`);
console.log(`Report: ${reportPath}`);

function buildCandidateRefCountsByType(values) {
  const countsByType = new Map();
  for (const doc of values) {
    const counts = countsByType.get(doc._type) || new Map();
    const gallery = Array.isArray(doc.gallery) ? doc.gallery.filter((item) => item?.assetRef) : [];
    for (const item of gallery) {
      if (item.assetRef === doc.imageRef || isBannerLike(item)) continue;
      counts.set(item.assetRef, (counts.get(item.assetRef) || 0) + 1);
    }
    countsByType.set(doc._type, counts);
  }
  return countsByType;
}

function buildAssignedRefsByType(values, countsByType) {
  const assignedByType = new Map();
  for (const type of types) {
    const counts = countsByType.get(type) || new Map();
    assignedByType.set(type, new Set());
    for (const doc of values.filter((value) => value._type === type)) {
      if (doc.imageRef && (counts.get(doc.imageRef) || 0) === 1) {
        assignedByType.get(type).add(doc.imageRef);
      }
    }
  }
  return assignedByType;
}

function buildDuplicateGroupKeepersByType(values, countsByType) {
  const keepersByType = new Map();
  for (const type of types) {
    const counts = countsByType.get(type) || new Map();
    const duplicates = new Map();
    for (const doc of values.filter((value) => value._type === type)) {
      if (!doc.imageRef || (counts.get(doc.imageRef) || 0) <= 1) continue;
      const group = duplicates.get(doc.imageRef) || [];
      group.push(doc);
      duplicates.set(doc.imageRef, group);
    }

    const keepers = new Map();
    for (const [imageRef, group] of duplicates.entries()) {
      const [keeper] = group.toSorted((a, b) => String(a.path || a.title || a._id).localeCompare(String(b.path || b.title || b._id)));
      if (keeper) keepers.set(imageRef, keeper._id);
    }
    keepersByType.set(type, keepers);
  }
  return keepersByType;
}

function selectMainImageCandidate(doc, gallery, candidateRefCounts, assignedRefs) {
  const used = new Set([doc.imageRef]);
  const nonBanner = gallery
    .map((item, index) => ({ ...item, index }))
    .filter((item) => item.assetRef && !used.has(item.assetRef) && !isBannerLike(item));

  if (nonBanner.length) return lowestDuplicateCandidate(nonBanner, candidateRefCounts, assignedRefs);

  const fallback = gallery
    .map((item, index) => ({ ...item, index }))
    .filter((item) => item.assetRef && !used.has(item.assetRef));

  return lowestDuplicateCandidate(fallback, candidateRefCounts, assignedRefs);
}

function lowestDuplicateCandidate(candidates, candidateRefCounts, assignedRefs) {
  const unused = candidates.filter((candidate) => !assignedRefs.has(candidate.assetRef));
  const pool = unused.length ? unused : candidates;

  return pool.toSorted((a, b) => {
    const aCount = candidateRefCounts.get(a.assetRef) || 0;
    const bCount = candidateRefCounts.get(b.assetRef) || 0;
    if (aCount !== bCount) return aCount - bCount;
    return a.index - b.index;
  })[0];
}

function isBannerLike(item) {
  const width = Number(item.width || 0);
  const height = Number(item.height || 0);
  if (!width || !height) return false;
  return width >= 1200 && width / height >= 2.4;
}

function toImageValue(item) {
  const value = {
    _type: "image",
    asset: item.asset,
  };
  if (item.crop) value.crop = item.crop;
  if (item.hotspot) value.hotspot = item.hotspot;
  return value;
}

function skip(doc, reason) {
  return {
    id: doc._id,
    type: doc._type,
    title: doc.title,
    path: doc.path,
    imageRef: doc.imageRef,
    reason,
  };
}

function summarizeDocs(values) {
  return Object.fromEntries(
    types.map((type) => {
      const scoped = values.filter((doc) => doc._type === type);
      const imageRefs = scoped.map((doc) => doc.imageRef).filter(Boolean);
      return [
        type,
        {
          documents: scoped.length,
          images: imageRefs.length,
          uniqueImages: new Set(imageRefs).size,
          topDuplicateCount: topCount(imageRefs),
        },
      ];
    }),
  );
}

async function summarizeCurrentState() {
  const values = await client.fetch(
    /* groq */ `*[
      _type in $types &&
      coalesce(language, "en") == $language &&
      !(_id in path("drafts.**"))
    ]{_type,"imageRef": image.asset._ref}`,
    { types, language },
  );

  return summarizeDocs(values);
}

function topCount(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) || 0) + 1);
  return Math.max(0, ...counts.values());
}

function countBy(values, key) {
  return values.reduce((counts, value) => {
    const group = value[key] || "unknown";
    counts[group] = (counts[group] || 0) + 1;
    return counts;
  }, {});
}

function timestamp() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\..+$/, "Z");
}

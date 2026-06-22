import { createClient } from "@sanity/client";
import fs from "node:fs/promises";
import path from "node:path";
import { loadEnvFile, parseArgs, requireToken } from "./sanity-env.mjs";

await loadEnvFile(".env.local");

const args = parseArgs(process.argv.slice(2));
const dryRun = Boolean(args.dryRun);
const projectId = args.projectId || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "o10sbz2i";
const dataset = args.dataset || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = args.apiVersion || process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-20";
const token = dryRun ? process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_TOKEN : requireToken(process.env.SANITY_API_TOKEN, "SANITY_API_TOKEN");
const reportPath = path.resolve(args.report || `reports/launch/sanity-image-assets-${dryRun ? "dry-run" : dataset}-${timestamp()}.json`);
const oldOriginPattern = /^https:\/\/www\.intcoframing-us\.com\//i;
const sourceId = "intcoframing-us-wordpress";
const partnerLogoPattern = 'const WHO_WE_ARE_PARTNER_LOGOS = Array.from({ length: 15 }, (_, index) => `https://www.intcoframing-us.com/wp-content/uploads/2024/01/comP${index + 1}.png`);';
const hardcodedFiles = [
  "src/app/[[...slug]]/page.tsx",
  "src/components/site-views.tsx",
  "src/components/site-chrome.tsx",
  "src/components/sustainability-interactions.tsx",
  "src/lib/solution-page-content.ts",
  "src/lib/source-category-listing-snapshots.ts",
  "src/lib/source-search-results.ts",
  "src/app/globals.css",
];

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const documentTypes = ["siteSettings", "homePage", "productCategory", "product", "solution", "project", "blogPost", "contentPage"];
const imageExtensions = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"]);
const fileExtensions = new Set([".pdf"]);
const assetCache = new Map();
const fileAssetCache = new Map();
const stats = {
  projectId,
  dataset,
  apiVersion,
  dryRun,
  documentsChecked: 0,
  documentsNeedingPatch: 0,
  documentPatches: 0,
  cmsUrls: 0,
  cmsStringImageUrls: 0,
  cmsStringFileUrls: 0,
  cmsStringPatches: 0,
  hardcodedImageUrls: 0,
  hardcodedFileUrls: 0,
  uniqueImageUrls: 0,
  uniqueFileUrls: 0,
  uniqueUrls: 0,
  existingAssets: 0,
  uploadedAssets: 0,
  failedUploads: 0,
  existingFileAssets: 0,
  uploadedFileAssets: 0,
  failedFileUploads: 0,
  skippedNonImages: 0,
  hardcodedFilesChanged: [],
  failures: [],
};

const docs = await client.fetch(
  /* groq */ `*[_type in $types]`,
  { types: documentTypes },
);

stats.documentsChecked = docs.length;

const cmsUrls = new Set();
const docPlans = [];

for (const doc of docs) {
  const plan = buildDocumentPatchPlan(doc, cmsUrls);
  if (Object.keys(plan.set).length) {
    docPlans.push(plan);
  }
}

stats.documentsNeedingPatch = docPlans.length;
stats.cmsUrls = cmsUrls.size;

const {
  plans: cmsStringPlans,
  imageUrls: cmsStringImageUrls,
  fileUrls: cmsStringFileUrls,
} = buildCmsStringReplacementPlans(docs);
stats.cmsStringImageUrls = cmsStringImageUrls.size;
stats.cmsStringFileUrls = cmsStringFileUrls.size;

const { imageUrls: hardcodedImageUrls, fileUrls: hardcodedFileUrls, generatedImageUrls } = await collectHardcodedUrls();
stats.hardcodedImageUrls = hardcodedImageUrls.size;
stats.hardcodedFileUrls = hardcodedFileUrls.size;

const allImageUrls = new Set([...cmsUrls, ...cmsStringImageUrls, ...hardcodedImageUrls]);
const allFileUrls = new Set([...cmsStringFileUrls, ...hardcodedFileUrls]);
stats.uniqueImageUrls = allImageUrls.size;
stats.uniqueFileUrls = allFileUrls.size;
stats.uniqueUrls = allImageUrls.size + allFileUrls.size;

if (dryRun) {
  await writeReport({
    ...stats,
    cmsStringPatches: cmsStringPlans.length,
    sampleCmsUrls: [...cmsUrls].slice(0, 25),
    sampleHardcodedImageUrls: [...hardcodedImageUrls].slice(0, 25),
    sampleHardcodedFileUrls: [...hardcodedFileUrls].slice(0, 25),
  });
  console.log(`Dry run complete: ${stats.uniqueImageUrls} image URLs and ${stats.uniqueFileUrls} file URLs found.`);
  console.log(`Documents needing image asset patches: ${stats.documentsNeedingPatch}.`);
  console.log(`Documents needing legacy media URL string patches: ${cmsStringPlans.length}.`);
  console.log(`Report: ${reportPath}`);
  process.exit(0);
}

console.log(`Uploading/reusing ${allImageUrls.size} unique old-site image URLs into Sanity ${projectId}/${dataset}...`);
let index = 0;
for (const url of allImageUrls) {
  index += 1;
  await imageRefForUrl(url);
  if (index % 25 === 0 || index === allImageUrls.size) {
    console.log(`Image asset progress: ${index}/${allImageUrls.size} (uploaded ${stats.uploadedAssets}, reused ${stats.existingAssets}, failed ${stats.failedUploads})`);
  }
}

console.log(`Uploading/reusing ${allFileUrls.size} unique old-site file URLs into Sanity ${projectId}/${dataset}...`);
index = 0;
for (const url of allFileUrls) {
  index += 1;
  await fileUrlForUrl(url);
  if (index % 10 === 0 || index === allFileUrls.size) {
    console.log(`File asset progress: ${index}/${allFileUrls.size} (uploaded ${stats.uploadedFileAssets}, reused ${stats.existingFileAssets}, failed ${stats.failedFileUploads})`);
  }
}

console.log(`Patching ${docPlans.length} Sanity documents to use image assets...`);
for (const plan of docPlans) {
  const resolvedSet = {};
  for (const [fieldPath, value] of Object.entries(plan.set)) {
    if (Array.isArray(value)) {
      const resolvedArray = [];
      for (const item of value) {
        if (typeof item === "string") {
          const ref = await imageRefForUrl(item);
          if (ref) resolvedArray.push(ref);
        } else if (item && typeof item === "object") {
          resolvedArray.push(await resolveNestedImageRefs(item));
        }
      }
      if (resolvedArray.length) resolvedSet[fieldPath] = resolvedArray;
    } else if (typeof value === "string") {
      const ref = await imageRefForUrl(value);
      if (ref) resolvedSet[fieldPath] = ref;
    } else if (value && typeof value === "object") {
      resolvedSet[fieldPath] = await resolveNestedImageRefs(value);
    }
  }

  if (!Object.keys(resolvedSet).length) continue;
  await client.patch(plan.id).set(resolvedSet).commit({ autoGenerateArrayKeys: true });
  stats.documentPatches += 1;
  if (stats.documentPatches % 50 === 0 || stats.documentPatches === docPlans.length) {
    console.log(`Document patch progress: ${stats.documentPatches}/${docPlans.length}`);
  }
}

const replacements = await buildUrlReplacements(new Set([...allImageUrls, ...allFileUrls]));
await patchCmsStringUrls(cmsStringPlans, replacements);
await replaceHardcodedUrls(replacements, generatedImageUrls);

await writeReport(stats);
console.log(`Sanity media asset backfill complete. Report: ${reportPath}`);

function buildDocumentPatchPlan(doc, urlSet) {
  const set = {};

  addSimpleImage(set, urlSet, "logo", doc.logoUrl, doc.logo);
  addSimpleImage(set, urlSet, "footerLogo", doc.footerLogoUrl, doc.footerLogo);
  addSimpleImage(set, urlSet, "image", doc.imageUrl, doc.image);
  addSimpleImage(set, urlSet, "navImage", doc.navImageUrl, doc.navImage);
  addSimpleImage(set, urlSet, "seo.ogImage", doc.seo?.ogImageUrl, doc.seo?.ogImage);

  if (Array.isArray(doc.galleryUrls) && doc.galleryUrls.some(isOldImageUrl) && !arrayHasAssets(doc.gallery)) {
    const urls = doc.galleryUrls.filter(isOldImageUrl);
    for (const url of urls) urlSet.add(url);
    set.gallery = urls;
  }

  if (Array.isArray(doc.heroSlides)) {
    let changed = false;
    const slides = doc.heroSlides.map((slide) => {
      if (isOldImageUrl(slide?.imageUrl) && !hasAssetRef(slide.image)) {
        urlSet.add(slide.imageUrl);
        changed = true;
        return { ...slide, image: slide.imageUrl };
      }
      return slide;
    });
    if (changed) set.heroSlides = slides;
  }

  if (isOldImageUrl(doc.companyProfile?.imageUrl) && !hasAssetRef(doc.companyProfile?.image)) {
    urlSet.add(doc.companyProfile.imageUrl);
    set.companyProfile = { ...doc.companyProfile, image: doc.companyProfile.imageUrl };
  }

  return { id: doc._id, set };
}

function addSimpleImage(set, urlSet, fieldName, url, currentValue) {
  if (!isOldImageUrl(url) || hasAssetRef(currentValue)) return;
  urlSet.add(url);
  set[fieldName] = url;
}

async function resolveNestedImageRefs(value) {
  if (Array.isArray(value)) {
    return Promise.all(value.map(resolveNestedImageRefs));
  }
  if (!value || typeof value !== "object") return value;
  const resolved = { ...value };
  for (const [key, nestedValue] of Object.entries(resolved)) {
    if (key === "image" && typeof nestedValue === "string") {
      const ref = await imageRefForUrl(nestedValue);
      if (ref) resolved[key] = ref;
    } else if (nestedValue && typeof nestedValue === "object") {
      resolved[key] = await resolveNestedImageRefs(nestedValue);
    }
  }
  return resolved;
}

async function imageRefForUrl(url) {
  if (!isOldImageUrl(url)) return undefined;
  if (assetCache.has(url)) return assetCache.get(url);

  const existing = await client.fetch(`*[_type == "sanity.imageAsset" && source.url == $url][0]{_id,url}`, { url });
  if (existing?._id) {
    const ref = imageRef(existing._id);
    assetCache.set(url, ref);
    stats.existingAssets += 1;
    return ref;
  }

  try {
    const response = await fetchOldSiteAsset(url, 90_000);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

    const contentType = response.headers.get("content-type") || "";
    const filename = filenameFromUrl(url);
    if (!contentType.startsWith("image/") && !imageExtensions.has(path.extname(filename).toLowerCase())) {
      stats.skippedNonImages += 1;
      assetCache.set(url, undefined);
      return undefined;
    }

    const bytes = Buffer.from(await response.arrayBuffer());
    const asset = await client.assets.upload("image", bytes, {
      filename,
      source: {
        id: sourceId,
        name: "intcoframing-us.com",
        url,
      },
    });
    const ref = imageRef(asset._id);
    assetCache.set(url, ref);
    stats.uploadedAssets += 1;
    return ref;
  } catch (error) {
    stats.failedUploads += 1;
    stats.failures.push({ url, message: error.message });
    assetCache.set(url, undefined);
    return undefined;
  }
}

async function fetchOldSiteAsset(url, timeoutMs) {
  return fetch(url, {
      headers: {
        "user-agent": "Mozilla/5.0 AppleWebKit/537.36 Chrome/124 Safari/537.36",
      },
      signal: AbortSignal.timeout(timeoutMs),
  });
}

async function fileUrlForUrl(url) {
  if (!isOldFileUrl(url)) return undefined;
  if (fileAssetCache.has(url)) return fileAssetCache.get(url);

  const existing = await client.fetch(`*[_type == "sanity.fileAsset" && source.url == $url][0]{_id,url}`, { url });
  if (existing?.url) {
    fileAssetCache.set(url, existing.url);
    stats.existingFileAssets += 1;
    return existing.url;
  }

  try {
    console.log(`File asset start: ${filenameFromUrl(url)}`);
    const response = await fetchOldSiteAsset(url, 90_000);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

    const filename = filenameFromUrl(url);
    const bytes = Buffer.from(await response.arrayBuffer());
    const asset = await client.assets.upload("file", bytes, {
      filename,
      source: {
        id: sourceId,
        name: "intcoframing-us.com",
        url,
      },
    });
    fileAssetCache.set(url, asset.url);
    stats.uploadedFileAssets += 1;
    console.log(`File asset complete: ${filename}`);
    return asset.url;
  } catch (error) {
    stats.failedFileUploads += 1;
    stats.failures.push({ url, message: error.message });
    fileAssetCache.set(url, undefined);
    return undefined;
  }
}

async function collectHardcodedUrls() {
  const imageUrls = new Set();
  const fileUrls = new Set();
  const generatedImageUrls = new Set();
  let hasGeneratedPartnerLogos = false;
  const matcher = /https:\/\/www\.intcoframing-us\.com\/[^"'`)\s]+/g;
  for (const file of hardcodedFiles) {
    const raw = await fs.readFile(path.resolve(file), "utf8");
    if (raw.includes(partnerLogoPattern)) hasGeneratedPartnerLogos = true;
    for (const match of raw.matchAll(matcher)) {
      const url = match[0];
      if (isOldImageUrl(url)) imageUrls.add(url);
      if (isOldFileUrl(url)) fileUrls.add(url);
    }
  }

  if (hasGeneratedPartnerLogos) {
    for (let index = 1; index <= 15; index += 1) {
      const url = `https://www.intcoframing-us.com/wp-content/uploads/2024/01/comP${index}.png`;
      generatedImageUrls.add(url);
      imageUrls.add(url);
    }
  }

  return { imageUrls, fileUrls, generatedImageUrls };
}

function buildCmsStringReplacementPlans(documents) {
  const plansByDocument = new Map();
  const imageUrls = new Set();
  const fileUrls = new Set();
  for (const doc of documents) {
    walkCmsStrings(doc, "", (fieldPath, value) => {
      const matched = collectOldMediaUrlsFromString(value, imageUrls, fileUrls);
      if (!matched) return;
      if (!plansByDocument.has(doc._id)) plansByDocument.set(doc._id, {});
      plansByDocument.get(doc._id)[fieldPath] = value;
    });
  }
  return {
    plans: [...plansByDocument].map(([id, set]) => ({ id, set })),
    imageUrls,
    fileUrls,
  };
}

function walkCmsStrings(value, fieldPath, visit) {
  if (typeof value === "string") {
    if (fieldPath && value.includes("https://www.intcoframing-us.com/")) visit(fieldPath, value);
    return;
  }
  if (!value || typeof value !== "object") return;

  if (Array.isArray(value)) {
    value.forEach((item, index) => walkCmsStrings(item, `${fieldPath}[${index}]`, visit));
    return;
  }

  for (const [key, nestedValue] of Object.entries(value)) {
    if (key.startsWith("_")) continue;
    const nextPath = fieldPath ? `${fieldPath}.${key}` : key;
    walkCmsStrings(nestedValue, nextPath, visit);
  }
}

function collectOldMediaUrlsFromString(value, imageUrls, fileUrls) {
  let matched = false;
  value.replace(/https:\/\/www\.intcoframing-us\.com\/[^"'`<>)\]\s]+/g, (url) => {
    if (isOldImageUrl(url) || isOldFileUrl(url)) {
      matched = true;
      if (isOldImageUrl(url)) imageUrls.add(url);
      if (isOldFileUrl(url)) fileUrls.add(url);
    }
    return url;
  });
  return matched;
}

async function buildUrlReplacements(urls) {
  const replacements = new Map();
  for (const url of urls) {
    if (isOldImageUrl(url)) {
      const ref = await imageRefForUrl(url);
      if (!ref?.asset?._ref) continue;
      const asset = await client.getDocument(ref.asset._ref);
      if (asset?.url) replacements.set(url, asset.url);
      continue;
    }

    if (isOldFileUrl(url)) {
      const assetUrl = await fileUrlForUrl(url);
      if (assetUrl) replacements.set(url, assetUrl);
    }
  }
  return replacements;
}

async function patchCmsStringUrls(plans, replacements) {
  console.log(`Patching ${plans.length} Sanity documents to replace legacy media URL strings...`);
  for (const plan of plans) {
    const resolvedSet = {};
    for (const [fieldPath, value] of Object.entries(plan.set)) {
      let nextValue = value;
      for (const [oldUrl, newUrl] of replacements) {
        nextValue = nextValue.split(oldUrl).join(newUrl);
      }
      if (nextValue !== value) resolvedSet[fieldPath] = nextValue;
    }
    if (!Object.keys(resolvedSet).length) continue;
    await client.patch(plan.id).set(resolvedSet).commit({ autoGenerateArrayKeys: true });
    stats.cmsStringPatches += 1;
    if (stats.cmsStringPatches % 50 === 0 || stats.cmsStringPatches === plans.length) {
      console.log(`CMS string patch progress: ${stats.cmsStringPatches}/${plans.length}`);
    }
  }
}

async function replaceHardcodedUrls(replacements, generatedImageUrls) {
  const partnerLogoUrls = [];
  for (const url of generatedImageUrls) {
    const replacement = replacements.get(url);
    if (replacement) partnerLogoUrls.push(replacement);
  }

  const partnerLogoReplacement = partnerLogoUrls.length === 15
    ? `const WHO_WE_ARE_PARTNER_LOGOS = [\n${partnerLogoUrls.map((url) => `  \"${url}\",`).join("\n")}\n];`
    : undefined;

  for (const file of hardcodedFiles) {
    const absolute = path.resolve(file);
    const before = await fs.readFile(absolute, "utf8");
    let after = before;
    for (const [oldUrl, newUrl] of replacements) {
      after = after.split(oldUrl).join(newUrl);
    }
    if (partnerLogoReplacement) {
      after = after.split(partnerLogoPattern).join(partnerLogoReplacement);
    }
    if (after !== before) {
      await fs.writeFile(absolute, after, "utf8");
      stats.hardcodedFilesChanged.push(file);
    }
  }
}

function imageRef(assetId) {
  return { _type: "image", asset: { _type: "reference", _ref: assetId } };
}

function hasAssetRef(value) {
  return Boolean(value?.asset?._ref);
}

function arrayHasAssets(value) {
  return Array.isArray(value) && value.some(hasAssetRef);
}

function isOldImageUrl(value) {
  if (typeof value !== "string" || !oldOriginPattern.test(value)) return false;
  const pathname = safePathname(value);
  return pathname.includes("/wp-content/") && imageExtensions.has(path.extname(pathname).toLowerCase());
}

function isOldFileUrl(value) {
  if (typeof value !== "string" || !oldOriginPattern.test(value)) return false;
  const pathname = safePathname(value);
  return pathname.includes("/wp-content/") && fileExtensions.has(path.extname(pathname).toLowerCase());
}

function filenameFromUrl(url) {
  const pathname = safePathname(url);
  const basename = pathname.split("/").pop() || "image.jpg";
  try {
    return decodeURIComponent(basename);
  } catch {
    return basename;
  }
}

function safePathname(url) {
  try {
    return new URL(url).pathname;
  } catch {
    return "";
  }
}

async function writeReport(summary) {
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
}

function timestamp() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

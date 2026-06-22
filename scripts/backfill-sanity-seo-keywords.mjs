import { createClient } from "@sanity/client";
import fs from "node:fs/promises";
import path from "node:path";
import { loadEnvFile, parseArgs, requireToken, sanityConfigFromEnv } from "./sanity-env.mjs";

await loadEnvFile(".env.local");

const args = parseArgs(process.argv.slice(2));
const { projectId, dataset, apiVersion } = sanityConfigFromEnv(args);
const token = args.dryRun ? process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_TOKEN : requireToken(process.env.SANITY_API_TOKEN, "SANITY_API_TOKEN");
const dryRun = Boolean(args.dryRun);
const overwrite = Boolean(args.overwrite);
const selectedTypes = normalizeList(args.types || "siteSettings,homePage,productCategory,product,solution,project,blogPost,contentPage");
const selectedLocales = normalizeList(args.locales || "en");
const limit = args.limit ? Number(args.limit) : undefined;
const sourceOrigin = "https://www.intcoframing-us.com";
const reportPath = path.resolve(args.report || `reports/launch/sanity-seo-keywords-${dryRun ? "dry-run" : dataset}-${timestamp()}.json`);

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

const docs = await client.fetch(
  /* groq */ `*[
    _type in $types &&
    coalesce(language, "en") in $locales
  ] | order(_type asc, path asc, _id asc){
    _id,
    _type,
    title,
    language,
    path,
    sourceUrl,
    sourceSite,
    seo
  }`,
  { types: selectedTypes, locales: selectedLocales },
);

const scopedDocs = Number.isFinite(limit) ? docs.slice(0, limit) : docs;
const patches = [];
const skipped = [];
const failures = [];

let checked = 0;
for (const doc of scopedDocs) {
  checked += 1;
  const sourceUrl = sourceUrlForDoc(doc);
  if (!sourceUrl) {
    skipped.push({ _id: doc._id, reason: "missing-source-url" });
    continue;
  }
  if (!overwrite && Array.isArray(doc.seo?.keywords) && doc.seo.keywords.length > 0) {
    skipped.push({ _id: doc._id, sourceUrl, reason: "already-has-keywords" });
    continue;
  }

  try {
    const html = await fetchHtml(sourceUrl);
    const keywords = parseMetaKeywords(html);
    if (!keywords.length) {
      skipped.push({ _id: doc._id, sourceUrl, reason: "no-meta-keywords" });
      continue;
    }
    patches.push({
      _id: doc._id,
      _type: doc._type,
      title: doc.title,
      language: doc.language || "en",
      path: doc.path,
      sourceUrl,
      keywords,
    });
  } catch (error) {
    failures.push({ _id: doc._id, sourceUrl, message: error.message });
  }

  if (checked % 50 === 0 || checked === scopedDocs.length) {
    console.log(`Keyword scan progress: ${checked}/${scopedDocs.length} (patches ${patches.length}, skipped ${skipped.length}, failures ${failures.length})`);
  }
}

if (!dryRun) {
  for (const chunk of chunkArray(patches, 50)) {
    let tx = client.transaction();
    for (const patch of chunk) {
      tx = tx.patch(patch._id, (operation) =>
        operation.set({
          "seo.keywords": patch.keywords,
        }),
      );
    }
    await tx.commit({ autoGenerateArrayKeys: true });
  }
}

const summary = {
  projectId,
  dataset,
  apiVersion,
  dryRun,
  overwrite,
  selectedTypes,
  selectedLocales,
  checkedDocs: scopedDocs.length,
  patchedDocs: patches.length,
  skippedDocs: skipped.length,
  failedDocs: failures.length,
  byType: selectedTypes.reduce((acc, type) => {
    acc[type] = patches.filter((patch) => patch._type === type).length;
    return acc;
  }, {}),
};

await fs.mkdir(path.dirname(reportPath), { recursive: true });
await fs.writeFile(
  reportPath,
  `${JSON.stringify(
    {
      checkedAt: new Date().toISOString(),
      summary,
      samplePatches: patches.slice(0, 25),
      sampleSkipped: skipped.slice(0, 25),
      failures,
    },
    null,
    2,
  )}\n`,
  "utf8",
);

console.log(`${dryRun ? "Would patch" : "Patched"} ${patches.length} document(s) with SEO keywords.`);
console.log(`Report: ${reportPath}`);
if (failures.length) process.exitCode = 1;

function sourceUrlForDoc(doc) {
  if (doc.sourceUrl) return doc.sourceUrl;
  if (doc._type === "siteSettings" && doc.sourceSite) return doc.sourceSite;
  if (doc._type === "homePage") return sourceOrigin;
  if (doc.path) return new URL(doc.path, sourceOrigin).toString();
  return "";
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 AppleWebKit/537.36 Chrome/124 Safari/537.36",
      accept: "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.text();
}

function parseMetaKeywords(html) {
  for (const tagMatch of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attrs = attrsFromTag(tagMatch[0]);
    const name = (attrs.name || attrs.property || "").trim().toLowerCase();
    if (name !== "keywords") continue;
    return normalizeKeywords(attrs.content || "");
  }
  return [];
}

function attrsFromTag(tag) {
  const attrs = {};
  const attrRe = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(["'])(.*?)\2/gs;
  for (const [, name, , value] of tag.matchAll(attrRe)) {
    attrs[name.toLowerCase()] = decodeHtml(value);
  }
  return attrs;
}

function normalizeKeywords(value) {
  const seen = new Set();
  return value
    .split(/[,，]/)
    .map((item) => item.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .filter((item) => {
      const key = item.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function decodeHtml(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function normalizeList(value) {
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function chunkArray(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function timestamp() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

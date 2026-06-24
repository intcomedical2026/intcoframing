import { createClient } from "@sanity/client";
import fs from "node:fs/promises";
import path from "node:path";
import { loadEnvFile, parseArgs, requireToken, sanityConfigFromEnv } from "./sanity-env.mjs";

await loadEnvFile(".env.local");

const args = parseArgs(process.argv.slice(2));
const { projectId, dataset, apiVersion } = sanityConfigFromEnv(args);
const dryRun = Boolean(args.dryRun);
const auditPath = path.resolve(args.audit || "reports/launch/seo-parity-audit-20260624.json");
const reportPath = path.resolve(args.report || `reports/launch/sanity-seo-parity-${dryRun ? "dry-run" : dataset}-${timestamp()}.json`);
const token = dryRun ? process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_TOKEN : requireToken(process.env.SANITY_API_TOKEN, "SANITY_API_TOKEN");

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
const audit = JSON.parse(await fs.readFile(auditPath, "utf8"));

const docs = await client.fetch(
  /* groq */ `*[
    _type in ["homePage", "contentPage", "productCategory", "product", "blogPost", "project", "solution"] &&
    coalesce(language, "en") == "en"
  ]{
    _id,
    _type,
    title,
    path,
    seo
  }`,
);

const docsByPath = new Map();
for (const doc of docs) {
  const docPath = doc._type === "homePage" ? "/" : normalizePath(doc.path);
  if (!docPath) continue;
  const existing = docsByPath.get(docPath) || [];
  existing.push(doc);
  docsByPath.set(docPath, existing);
}

const allowedTypes = new Set(["page", "product-category", "product", "news", "project"]);
const patches = [];
const skipped = [];

for (const row of audit.audited || []) {
  if (!allowedTypes.has(row.type)) {
    skipped.push({ path: row.path, reason: "unsupported-audit-type", type: row.type });
    continue;
  }
  if (row.oldStatus !== 200 || row.newStatus !== 200) {
    skipped.push({ path: row.path, reason: "non-200-status", oldStatus: row.oldStatus, newStatus: row.newStatus });
    continue;
  }
  const oldSeo = row.old || {};
  if (!oldSeo.title) {
    skipped.push({ path: row.path, reason: "missing-old-title" });
    continue;
  }

  const doc = chooseDoc(docsByPath.get(normalizePath(row.path)) || []);
  if (!doc) {
    skipped.push({ path: row.path, reason: "no-sanity-document", type: row.type });
    continue;
  }

  const nextSeo = {
    ...(doc.seo || {}),
    seoTitle: decodeHtml(oldSeo.title),
    seoDescription: decodeHtml(oldSeo.desc || ""),
    keywords: normalizeKeywords(oldSeo.keywords || ""),
  };
  const currentSeo = doc.seo || {};
  const changed =
    currentSeo.seoTitle !== nextSeo.seoTitle ||
    currentSeo.seoDescription !== nextSeo.seoDescription ||
    JSON.stringify(currentSeo.keywords || []) !== JSON.stringify(nextSeo.keywords);

  if (!changed) {
    skipped.push({ path: row.path, _id: doc._id, reason: "already-in-sync" });
    continue;
  }

  patches.push({
    _id: doc._id,
    _type: doc._type,
    path: normalizePath(row.path),
    title: doc.title,
    oldSeo: {
      seoTitle: currentSeo.seoTitle,
      seoDescription: currentSeo.seoDescription,
      keywords: currentSeo.keywords || [],
    },
    nextSeo: {
      seoTitle: nextSeo.seoTitle,
      seoDescription: nextSeo.seoDescription,
      keywords: nextSeo.keywords,
    },
  });
}

if (!dryRun) {
  for (const chunk of chunkArray(patches, 50)) {
    let tx = client.transaction();
    for (const patch of chunk) {
      tx = tx.patch(patch._id, (operation) =>
        operation.set({
          "seo.seoTitle": patch.nextSeo.seoTitle,
          "seo.seoDescription": patch.nextSeo.seoDescription,
          "seo.keywords": patch.nextSeo.keywords,
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
  auditPath,
  checkedRows: audit.audited?.length || 0,
  patchedDocs: patches.length,
  skippedRows: skipped.length,
  byType: patches.reduce((acc, patch) => {
    acc[patch._type] = (acc[patch._type] || 0) + 1;
    return acc;
  }, {}),
  skippedByReason: skipped.reduce((acc, item) => {
    acc[item.reason] = (acc[item.reason] || 0) + 1;
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
      patches,
      skipped,
    },
    null,
    2,
  )}\n`,
  "utf8",
);

console.log(`${dryRun ? "Would patch" : "Patched"} ${patches.length} document(s) from ${auditPath}.`);
console.log(JSON.stringify(summary, null, 2));
console.log(`Report: ${reportPath}`);

function chooseDoc(candidates) {
  if (!candidates.length) return null;
  const priority = ["homePage", "contentPage", "productCategory", "product", "blogPost", "project", "solution"];
  return [...candidates].sort((a, b) => priority.indexOf(a._type) - priority.indexOf(b._type))[0];
}

function normalizePath(value) {
  if (!value) return "";
  try {
    value = new URL(value).pathname;
  } catch {
    // Keep the path-like value.
  }
  const normalized = String(value).trim().replace(/\/+$/, "");
  return normalized || "/";
}

function normalizeKeywords(value) {
  const seen = new Set();
  return String(value || "")
    .split(/[,，]/)
    .map((item) => decodeHtml(item).replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .filter((item) => {
      const key = item.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function decodeHtml(value) {
  return String(value || "")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
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

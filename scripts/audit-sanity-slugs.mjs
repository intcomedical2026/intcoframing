import { createClient } from "@sanity/client";
import fs from "node:fs/promises";
import path from "node:path";
import { loadEnvFile, parseArgs, sanityConfigFromEnv } from "./sanity-env.mjs";

await loadEnvFile(".env.local");

const args = parseArgs(process.argv.slice(2));
const { projectId, dataset, apiVersion } = sanityConfigFromEnv(args);
const reportPath = path.resolve(args.report || `reports/launch/sanity-slug-audit-${dataset}-${timestamp()}.json`);
const token = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_TOKEN;
const types = ["productCategory", "product", "solution", "project", "blogPost", "contentPage"];
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const documents = await client.fetch(
  /* groq */ `*[_type in $types]{
    _id,
    _type,
    title,
    language,
    translationGroup,
    path,
    slug
  }`,
  { types },
);

const missing = [];
const malformed = [];
const invalidFormat = [];
const pathSlugMismatches = [];
const byTypeSlug = new Map();
const byTypeLanguageSlug = new Map();

for (const document of documents) {
  const slug = document.slug?.current;
  if (!document.slug || typeof document.slug !== "object" || document.slug._type !== "slug") malformed.push(summaryFor(document));
  if (!slug) {
    missing.push(summaryFor(document));
    continue;
  }

  if (!slugPattern.test(slug)) invalidFormat.push(summaryFor(document, { slug }));

  const typeSlugKey = `${document._type}\u0000${slug}`;
  const typeLanguageSlugKey = `${document._type}\u0000${document.language || "en"}\u0000${slug}`;
  pushGrouped(byTypeSlug, typeSlugKey, document);
  pushGrouped(byTypeLanguageSlug, typeLanguageSlugKey, document);

  const pathTail = pathTailFor(document.path);
  if (pathTail && pathTail !== slug) {
    pathSlugMismatches.push(summaryFor(document, { slug, pathTail }));
  }
}

const crossLanguageDuplicates = groupedDuplicates(byTypeSlug).filter((group) => group.languages.length > 1);
const sameLanguageDuplicates = groupedDuplicates(byTypeLanguageSlug);

const summary = {
  projectId,
  dataset,
  apiVersion,
  scannedDocuments: documents.length,
  ok: missing.length === 0 && malformed.length === 0 && invalidFormat.length === 0 && sameLanguageDuplicates.length === 0,
  blockingIssues: {
    missing: missing.length,
    malformed: malformed.length,
    invalidFormat: invalidFormat.length,
    sameLanguageDuplicates: sameLanguageDuplicates.length,
  },
  informational: {
    crossLanguageDuplicates: crossLanguageDuplicates.length,
    pathSlugMismatches: pathSlugMismatches.length,
  },
  samples: {
    missing: missing.slice(0, 20),
    malformed: malformed.slice(0, 20),
    invalidFormat: invalidFormat.slice(0, 20),
    sameLanguageDuplicates: sameLanguageDuplicates.slice(0, 20),
    crossLanguageDuplicates: crossLanguageDuplicates.slice(0, 20),
    pathSlugMismatches: pathSlugMismatches.slice(0, 20),
  },
};

await fs.mkdir(path.dirname(reportPath), { recursive: true });
await fs.writeFile(reportPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");

console.log(
  `Slug audit ${summary.ok ? "passed" : "failed"}: ${summary.scannedDocuments} document(s), ${sameLanguageDuplicates.length} same-language duplicate group(s), ${crossLanguageDuplicates.length} cross-language duplicate group(s).`,
);
console.log(`Wrote report to ${reportPath}`);

if (!summary.ok && args.failOnError !== false) process.exit(1);

function pushGrouped(map, key, document) {
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(document);
}

function groupedDuplicates(map) {
  return [...map.entries()]
    .filter(([, items]) => items.length > 1)
    .map(([key, items]) => ({
      key: key.split("\u0000"),
      count: items.length,
      languages: [...new Set(items.map((item) => item.language || "en"))].sort(),
      ids: items.map((item) => item._id),
      titles: [...new Set(items.map((item) => item.title).filter(Boolean))].slice(0, 8),
    }));
}

function summaryFor(document, extra = {}) {
  return {
    _id: document._id,
    _type: document._type,
    language: document.language,
    title: document.title,
    path: document.path,
    ...extra,
  };
}

function pathTailFor(value) {
  return String(value || "").split("/").filter(Boolean).at(-1);
}

function timestamp() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

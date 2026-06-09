import { createClient } from "@sanity/client";
import fs from "node:fs/promises";
import path from "node:path";
import { loadEnvFile, parseArgs, requireToken, sanityConfigFromEnv } from "./sanity-env.mjs";

await loadEnvFile(".env.local");

const args = parseArgs(process.argv.slice(2));
const { projectId, dataset, apiVersion } = sanityConfigFromEnv(args);
const token = requireToken(process.env.SANITY_API_TOKEN, "SANITY_API_TOKEN");
const dryRun = args.dryRun === true || process.env.SANITY_INVALID_DATES_DRY_RUN === "true";
const reportPath = path.resolve(args.report || `reports/launch/sanity-invalid-dates-${dryRun ? "dry-run" : dataset}-${timestamp()}.json`);
const types = ["homePage", "productCategory", "product", "solution", "project", "blogPost", "contentPage"];
const dateFields = ["publishedAt", "updatedAt", "datePublished", "dateModified"];

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
    publishedAt,
    updatedAt,
    datePublished,
    dateModified
  }`,
  { types },
);

const results = [];
const patches = [];

for (const document of documents) {
  const invalidFields = dateFields.filter((field) => isInvalidDateValue(document[field]));
  if (!invalidFields.length) continue;

  results.push({
    _id: document._id,
    _type: document._type,
    language: document.language,
    title: document.title,
    invalidFields: Object.fromEntries(invalidFields.map((field) => [field, document[field]])),
  });

  if (!dryRun) patches.push({ id: document._id, fields: invalidFields });
}

if (!dryRun) await commitPatchesInBatches(patches);

const summary = {
  projectId,
  dataset,
  apiVersion,
  dryRun,
  scannedDocuments: documents.length,
  affectedDocuments: results.length,
  invalidDateOccurrences: results.reduce((total, result) => total + Object.keys(result.invalidFields).length, 0),
  results,
};

await fs.mkdir(path.dirname(reportPath), { recursive: true });
await fs.writeFile(reportPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");

console.log(
  `${dryRun ? "Found" : "Removed"} ${summary.invalidDateOccurrences} invalid date field occurrence(s) across ${summary.affectedDocuments} document(s).`,
);
console.log(`Wrote report to ${reportPath}`);

async function commitPatchesInBatches(items, size = 25) {
  for (let index = 0; index < items.length; index += size) {
    const batch = items.slice(index, index + size);
    let transaction = client.transaction();
    for (const item of batch) {
      transaction = transaction.patch(item.id, (patch) => patch.unset(item.fields));
    }
    await transaction.commit();
    console.log(`Patched ${Math.min(index + size, items.length)} / ${items.length}`);
  }
}

function isInvalidDateValue(value) {
  if (value === undefined || value === null) return false;
  if (typeof value !== "string") return true;
  if (!value.trim()) return true;
  return Number.isNaN(Date.parse(value));
}

function timestamp() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

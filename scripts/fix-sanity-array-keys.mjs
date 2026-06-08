import { createClient } from "@sanity/client";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { loadEnvFile, parseArgs, requireToken, sanityConfigFromEnv } from "./sanity-env.mjs";

await loadEnvFile(".env.local");

const args = parseArgs(process.argv.slice(2));
const { projectId, dataset, apiVersion } = sanityConfigFromEnv(args);
const token = requireToken(process.env.SANITY_API_TOKEN, "SANITY_API_TOKEN");
const dryRun = args.dryRun === true || process.env.SANITY_ARRAY_KEYS_DRY_RUN === "true";
const reportPath = path.resolve(args.report || `reports/launch/sanity-array-keys-${dryRun ? "dry-run" : dataset}-${timestamp()}.json`);
const types = [
  "siteSettings",
  "homePage",
  "productCategory",
  "product",
  "solution",
  "project",
  "blogPost",
  "contentPage",
];

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const documents = await client.fetch(
  /* groq */ `*[_type in $types]{
    ...
  }`,
  { types },
);

const results = [];
const patches = [];
for (const document of documents) {
  const { updates, missingKeyCount, affectedFields } = normalizeDocument(document);
  if (missingKeyCount === 0) continue;

  results.push({
    _id: document._id,
    _type: document._type,
    language: document.language,
    title: document.title,
    missingKeyCount,
    affectedFields,
  });

  if (!dryRun) {
    patches.push({ id: document._id, updates });
  }
}

if (!dryRun) {
  await commitPatchesInBatches(patches);
}

const summary = {
  projectId,
  dataset,
  apiVersion,
  dryRun,
  scannedDocuments: documents.length,
  affectedDocuments: results.length,
  missingKeyCount: results.reduce((total, result) => total + result.missingKeyCount, 0),
  results,
};

await fs.mkdir(path.dirname(reportPath), { recursive: true });
await fs.writeFile(reportPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");

console.log(
  `${dryRun ? "Found" : "Fixed"} ${summary.missingKeyCount} missing Sanity array key(s) across ${summary.affectedDocuments} document(s).`,
);
console.log(`Wrote report to ${reportPath}`);

async function commitPatchesInBatches(items, size = 25) {
  for (let index = 0; index < items.length; index += size) {
    const batch = items.slice(index, index + size);
    let transaction = client.transaction();
    for (const item of batch) {
      transaction = transaction.patch(item.id, (patch) => patch.set(item.updates));
    }
    await transaction.commit({ autoGenerateArrayKeys: false });
    console.log(`Patched ${Math.min(index + size, items.length)} / ${items.length}`);
  }
}

function normalizeDocument(document) {
  const updates = {};
  const affectedFields = [];
  let missingKeyCount = 0;

  for (const [field, value] of Object.entries(document)) {
    if (field.startsWith("_")) continue;
    const normalized = normalizeValue(value, [field]);
    if (normalized.missingKeyCount > 0) {
      updates[field] = normalized.value;
      missingKeyCount += normalized.missingKeyCount;
      affectedFields.push(field);
    }
  }

  return { updates, missingKeyCount, affectedFields };
}

function normalizeValue(value, pathSegments) {
  if (Array.isArray(value)) {
    const usedKeys = new Set();
    let missingKeyCount = 0;
    const normalizedItems = value.map((item, index) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return item;

      const nested = normalizeValue(item, [...pathSegments, String(index)]);
      const existingKey = typeof nested.value._key === "string" && nested.value._key.trim() ? nested.value._key.trim() : undefined;
      const fallbackKey = stableArrayKey(pathSegments, index, nested.value);
      const key = uniqueArrayKey(existingKey || fallbackKey, usedKeys);

      if (!existingKey) missingKeyCount += 1;
      missingKeyCount += nested.missingKeyCount;

      return { ...nested.value, _key: key };
    });

    return { value: normalizedItems, missingKeyCount };
  }

  if (!value || typeof value !== "object") return { value, missingKeyCount: 0 };

  let missingKeyCount = 0;
  const normalizedObject = {};
  for (const [field, child] of Object.entries(value)) {
    const normalized = normalizeValue(child, [...pathSegments, field]);
    normalizedObject[field] = normalized.value;
    missingKeyCount += normalized.missingKeyCount;
  }

  return { value: normalizedObject, missingKeyCount };
}

function stableArrayKey(pathSegments, index, item) {
  const payload = JSON.stringify({ path: pathSegments.join("."), index, item: { ...item, _key: undefined } });
  return `k${crypto.createHash("sha1").update(payload).digest("hex").slice(0, 11)}`;
}

function uniqueArrayKey(key, usedKeys) {
  let candidate = key;
  let suffix = 1;
  while (usedKeys.has(candidate)) {
    candidate = `${key}${suffix}`;
    suffix += 1;
  }
  usedKeys.add(candidate);
  return candidate;
}

function timestamp() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

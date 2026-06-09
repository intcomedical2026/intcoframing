import { createClient } from "@sanity/client";
import fs from "node:fs/promises";
import path from "node:path";
import { loadEnvFile, parseArgs, requireToken, sanityConfigFromEnv } from "./sanity-env.mjs";

await loadEnvFile(".env.local");

const args = parseArgs(process.argv.slice(2));
const { projectId, dataset, apiVersion } = sanityConfigFromEnv(args);
const token = requireToken(process.env.SANITY_API_TOKEN, "SANITY_API_TOKEN");
const dryRun = args.dryRun === true || process.env.SANITY_UNKNOWN_FIELDS_DRY_RUN === "true";
const reportPath = path.resolve(args.report || `reports/launch/sanity-unknown-fields-${dryRun ? "dry-run" : dataset}-${timestamp()}.json`);
const sharedSeoFields = new Set(["language", "translationGroup", "seo", "faqs", "evidence", "datePublished", "dateModified"]);
const sharedMigrationFields = new Set(["legacyUrls", "sourceUrl", "sourceId"]);
const sharedInquiryField = "inquiryRouting";
const allowedFieldsByType = {
  siteSettings: new Set([
    "language",
    "translationGroup",
    "title",
    "description",
    "sourceSite",
    "logo",
    "logoUrl",
    "footerLogo",
    "footerLogoUrl",
    "phone",
    "secondaryPhone",
    "email",
    "address",
    "contactPoints",
    "sameAs",
    "navigation",
    "footerColumns",
    "seo",
    "faqs",
    "evidence",
    "datePublished",
    "dateModified",
  ]),
  homePage: new Set([
    "language",
    "translationGroup",
    "title",
    "heroSlides",
    "companyProfile",
    "stats",
    "projectsIntro",
    "blogIntro",
    ...sharedSeoFields,
  ]),
  productCategory: new Set([
    "title",
    "slug",
    "path",
    "parentSlug",
    "description",
    "imageAlt",
    "image",
    "imageUrl",
    "navImageAlt",
    "navImage",
    "navImageUrl",
    "order",
    sharedInquiryField,
    ...sharedSeoFields,
    ...sharedMigrationFields,
  ]),
  product: new Set([
    "title",
    "slug",
    "path",
    "categorySlugs",
    "mainCategorySlug",
    "description",
    "bodyText",
    "sku",
    "brand",
    "material",
    "dimensions",
    "offers",
    "imageAlt",
    "image",
    "imageUrl",
    "gallery",
    "galleryUrls",
    "publishedAt",
    "updatedAt",
    sharedInquiryField,
    ...sharedSeoFields,
    ...sharedMigrationFields,
  ]),
  solution: new Set([
    "title",
    "slug",
    "path",
    "description",
    "bodyText",
    "imageAlt",
    "image",
    "imageUrl",
    "order",
    sharedInquiryField,
    ...sharedSeoFields,
    ...sharedMigrationFields,
  ]),
  project: new Set([
    "title",
    "slug",
    "path",
    "category",
    "description",
    "bodyText",
    "imageAlt",
    "image",
    "imageUrl",
    "gallery",
    "galleryUrls",
    sharedInquiryField,
    ...sharedSeoFields,
    ...sharedMigrationFields,
  ]),
  blogPost: new Set([
    "title",
    "slug",
    "path",
    "category",
    "excerpt",
    "bodyText",
    "imageAlt",
    "image",
    "imageUrl",
    "gallery",
    "galleryUrls",
    "publishedAt",
    ...sharedSeoFields,
    ...sharedMigrationFields,
  ]),
  contentPage: new Set([
    "title",
    "slug",
    "path",
    "description",
    "bodyText",
    "imageAlt",
    "image",
    "imageUrl",
    sharedInquiryField,
    ...sharedSeoFields,
    ...sharedMigrationFields,
  ]),
};
const types = Object.keys(allowedFieldsByType);

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
const fieldCounts = {};
const patches = [];

for (const document of documents) {
  const unknownFields = findTopLevelUnknownFields(document);
  if (!unknownFields.length) continue;

  for (const field of unknownFields) {
    fieldCounts[`${document._type}.${field}`] = (fieldCounts[`${document._type}.${field}`] || 0) + 1;
  }

  results.push({
    _id: document._id,
    _type: document._type,
    language: document.language,
    title: document.title,
    unknownFields,
  });

  if (!dryRun) patches.push({ id: document._id, fields: unknownFields });
}

if (!dryRun) await commitPatchesInBatches(patches);

const summary = {
  projectId,
  dataset,
  apiVersion,
  dryRun,
  scannedDocuments: documents.length,
  affectedDocuments: results.length,
  unknownFieldOccurrences: results.reduce((total, result) => total + result.unknownFields.length, 0),
  fieldCounts,
  results,
};

await fs.mkdir(path.dirname(reportPath), { recursive: true });
await fs.writeFile(reportPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");

console.log(
  `${dryRun ? "Found" : "Removed"} ${summary.unknownFieldOccurrences} unknown field occurrence(s) across ${summary.affectedDocuments} document(s).`,
);
console.log(`Wrote report to ${reportPath}`);

function findTopLevelUnknownFields(document) {
  const allowed = allowedFieldsByType[document._type];
  if (!allowed) return [];
  return Object.keys(document).filter((field) => !field.startsWith("_") && !allowed.has(field));
}

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

function timestamp() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

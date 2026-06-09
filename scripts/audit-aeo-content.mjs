import { createClient } from "@sanity/client";
import fs from "node:fs/promises";
import path from "node:path";
import { loadEnvFile, parseArgs, sanityConfigFromEnv } from "./sanity-env.mjs";

await loadEnvFile(".env.local");

const args = parseArgs(process.argv.slice(2));
const { projectId, dataset, apiVersion } = sanityConfigFromEnv(args);
const token = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_TOKEN;
const locales = normalizeLocales(args.locales || "en,es,pt,fr,de,ja");
const reportPath = path.resolve(args.report || `reports/launch/aeo-content-audit-${dataset}-${timestamp()}.json`);
const intelligenceTypes = ["siteSettings", "homePage", "productCategory", "product", "solution", "project", "blogPost", "contentPage"];

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const docs = await client.fetch(
  /* groq */ `*[_type in $types && language in $locales] | order(language asc, _type asc, path asc, _id asc){
    _id,
    _type,
    language,
    title,
    path,
    faqs,
    evidence,
    dateModified
  }`,
  { types: intelligenceTypes, locales },
);

const failures = [];
const summary = {
  totalDocs: docs.length,
  docsWithThreeFaqs: 0,
  docsWithEvidence: 0,
  docsWithDateModified: 0,
  totalFaqs: 0,
  totalEvidence: 0,
};

for (const doc of docs) {
  const label = `${doc.language}:${doc._type}:${doc.path || doc._id}`;
  const faqs = Array.isArray(doc.faqs) ? doc.faqs : [];
  const evidence = Array.isArray(doc.evidence) ? doc.evidence : [];

  summary.totalFaqs += faqs.length;
  summary.totalEvidence += evidence.length;
  if (faqs.length >= 3) summary.docsWithThreeFaqs += 1;
  if (evidence.length > 0) summary.docsWithEvidence += 1;
  if (doc.dateModified) summary.docsWithDateModified += 1;

  if (faqs.length < 3) failures.push({ doc: label, field: "faqs", issue: "Expected at least 3 FAQ items.", actual: faqs.length });
  if (!doc.dateModified) failures.push({ doc: label, field: "dateModified", issue: "Missing dateModified freshness signal." });

  const anchors = new Set();
  for (const [index, faq] of faqs.entries()) {
    const prefix = `faqs[${index}]`;
    if (!faq.question) failures.push({ doc: label, field: `${prefix}.question`, issue: "Missing FAQ question." });
    if (!faq.answer) failures.push({ doc: label, field: `${prefix}.answer`, issue: "Missing FAQ answer." });
    if (!faq.anchorId) failures.push({ doc: label, field: `${prefix}.anchorId`, issue: "Missing persistent anchor ID." });
    if (faq.anchorId && anchors.has(faq.anchorId)) failures.push({ doc: label, field: `${prefix}.anchorId`, issue: "Duplicate FAQ anchor ID.", actual: faq.anchorId });
    if (faq.anchorId) anchors.add(faq.anchorId);

    if (faq.question && !/[?？]$/.test(faq.question.trim())) {
      failures.push({ doc: label, field: `${prefix}.question`, issue: "FAQ question should end with a question mark.", actual: faq.question });
    }

    if (faq.answer) {
      const answer = normalizeText(faq.answer);
      if (/\.\.\.$/.test(answer)) failures.push({ doc: label, field: `${prefix}.answer`, issue: "FAQ answer ends with an ellipsis instead of a complete answer." });
      if (doc.language === "ja") {
        if (answer.length < 40) failures.push({ doc: label, field: `${prefix}.answer`, issue: "Japanese FAQ answer is too short for extraction.", actual: answer.length });
        if (answer.length > 260) failures.push({ doc: label, field: `${prefix}.answer`, issue: "Japanese FAQ answer is too long for concise extraction.", actual: answer.length });
      } else {
        const words = wordCount(answer);
        if (words < 20) failures.push({ doc: label, field: `${prefix}.answer`, issue: "FAQ answer is too short for answer extraction.", actual: words });
        if (words > 90) failures.push({ doc: label, field: `${prefix}.answer`, issue: "FAQ answer is too long for concise answer extraction.", actual: words });
      }
    }
  }

  if (!evidence.length) failures.push({ doc: label, field: "evidence", issue: "Expected at least 1 evidence item." });
  for (const [index, item] of evidence.entries()) {
    for (const field of ["claim", "methodology", "sourceName", "sourceUrl", "collectedAt", "limitations"]) {
      if (!item[field]) failures.push({ doc: label, field: `evidence[${index}].${field}`, issue: "Missing evidence field." });
    }
    if (item.sourceUrl && !/^https?:\/\//.test(item.sourceUrl)) {
      failures.push({ doc: label, field: `evidence[${index}].sourceUrl`, issue: "Evidence source URL must be absolute.", actual: item.sourceUrl });
    }
  }
}

const report = {
  projectId,
  dataset,
  apiVersion,
  locales,
  checkedAt: new Date().toISOString(),
  ok: failures.length === 0,
  thresholds: {
    minFaqsPerDoc: 3,
    nonJapaneseFaqAnswerWords: "20-90",
    japaneseFaqAnswerCharacters: "40-260",
    requiredEvidenceFields: ["claim", "methodology", "sourceName", "sourceUrl", "collectedAt", "limitations"],
  },
  summary,
  failureCount: failures.length,
  failures: failures.slice(0, 250),
};

await fs.mkdir(path.dirname(reportPath), { recursive: true });
await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

if (!report.ok) {
  console.error(`AEO content audit failed for ${projectId}/${dataset}: ${failures.length} failures.`);
  console.error(`Wrote report to ${reportPath}`);
  process.exit(1);
}

console.log(`AEO content audit passed for ${projectId}/${dataset}.`);
console.log(`Wrote report to ${reportPath}`);

function normalizeLocales(value) {
  const valid = ["en", "es", "pt", "fr", "de", "ja"];
  const selected = String(value)
    .split(",")
    .map((locale) => locale.trim())
    .filter(Boolean);
  const invalid = selected.filter((locale) => !valid.includes(locale));
  if (invalid.length) {
    console.error(`Invalid locale(s): ${invalid.join(", ")}`);
    process.exit(1);
  }
  return selected.length ? selected : valid;
}

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function wordCount(value) {
  return normalizeText(value).split(/\s+/).filter(Boolean).length;
}

function timestamp() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

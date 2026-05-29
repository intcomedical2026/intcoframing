import { createClient } from "@sanity/client";
import fs from "node:fs/promises";
import path from "node:path";
import seed from "../sanity/seed/intcoframing.seed.json" with { type: "json" };
import localizedSeed from "../sanity/seed/intcoframing.localized.json" with { type: "json" };
import { loadEnvFile, parseArgs, sanityConfigFromEnv } from "./sanity-env.mjs";

await loadEnvFile(".env.local");

const args = parseArgs(process.argv.slice(2));
const { projectId, dataset, apiVersion } = sanityConfigFromEnv(args);
const token = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_TOKEN;
const locales = normalizeLocales(args.locales || "en,es,pt,fr,de,ja");
const reportPath = path.resolve(args.report || `reports/launch/sanity-import-verify-${dataset}-${timestamp()}.json`);

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const expected = expectedCounts(locales);
const expectedIntelligence = expectedIntelligenceCounts(locales);
const query = /* groq */ `{
  "datasetsVisible": true,
  "counts": *[_type in $types && language in $locales]{
    _type,
    language
  },
  "missing": {
    "language": count(*[_type in $types && !defined(language)]),
    "translationGroup": count(*[_type in $types && language in $locales && !defined(translationGroup)]),
    "seo": count(*[_type in $types && language in $locales && (!defined(seo.seoTitle) || !defined(seo.seoDescription) || !defined(seo.canonicalPath))]),
    "imageAlt": count(*[_type in $types && language in $locales && defined(imageUrl) && imageUrl != "" && !defined(imageAlt)]),
    "legacyUrls": count(*[_type in $types && language in $locales && defined(sourceUrl) && !defined(legacyUrls[0])]),
    "productBrand": count(*[_type == "product" && language in $locales && !defined(brand)]),
    "productOffers": count(*[_type == "product" && language in $locales && !defined(offers[0])])
  },
  "productSpecs": {
    "total": count(*[_type == "product" && language in $locales]),
    "sku": count(*[_type == "product" && language in $locales && defined(sku)]),
    "brand": count(*[_type == "product" && language in $locales && defined(brand)]),
    "material": count(*[_type == "product" && language in $locales && defined(material)]),
    "dimensions": count(*[_type == "product" && language in $locales && defined(dimensions)]),
    "offers": count(*[_type == "product" && language in $locales && defined(offers[0])])
  },
  "intelligence": {
    "faqs": count(*[_type in $intelligenceTypes && language in $locales && defined(faqs[0])]),
    "evidence": count(*[_type in $intelligenceTypes && language in $locales && defined(evidence[0])])
  },
  "sampleDocs": *[_type in $types && language in $locales] | order(language asc, _type asc, _id asc)[0...12]{
    _id,
    _type,
    language,
    translationGroup,
    "slug": slug.current,
    path,
    "seoTitle": seo.seoTitle,
    "canonicalPath": seo.canonicalPath
  }
}`;

let data;
try {
  data = await client.fetch(query, {
    types: Object.keys(expected.en),
    intelligenceTypes: ["siteSettings", "homePage", "productCategory", "solution", "project", "contentPage"],
    locales,
  });
} catch (error) {
  const summary = {
    projectId,
    dataset,
    apiVersion,
    locales,
    ok: false,
    error: error.message,
  };
  await writeReport(summary);
  console.error(`Sanity import verification failed: ${error.message}`);
  process.exit(1);
}

const actualCounts = countByLocaleAndType(data.counts, locales, Object.keys(expected.en));
const countFailures = compareCounts(expected, actualCounts);
const missingFailures = Object.entries(data.missing).filter(([, value]) => value !== 0);
const intelligenceFailures = Object.entries(expectedIntelligence).filter(([key, value]) => data.intelligence?.[key] !== value);
const ok = countFailures.length === 0 && missingFailures.length === 0 && intelligenceFailures.length === 0;

const summary = {
  projectId,
  dataset,
  apiVersion,
  locales,
  ok,
  expectedCounts: expected,
  actualCounts,
  countFailures,
  missing: data.missing,
  missingFailures: Object.fromEntries(missingFailures),
  productSpecs: data.productSpecs,
  expectedIntelligence,
  intelligence: data.intelligence,
  intelligenceFailures: Object.fromEntries(intelligenceFailures),
  sampleDocs: data.sampleDocs,
};

await writeReport(summary);

if (!ok) {
  console.error(`Sanity import verification failed for ${projectId}/${dataset}.`);
  console.error(`Count failures: ${countFailures.length}`);
  console.error(`Missing-field failure groups: ${missingFailures.length}`);
  console.error(`Intelligence failure groups: ${intelligenceFailures.length}`);
  process.exit(1);
}

console.log(`Sanity import verification passed for ${projectId}/${dataset}.`);
console.log(`Wrote verification report to ${reportPath}`);

function expectedCounts(selectedLocales) {
  const result = {};
  for (const locale of selectedLocales) {
    const source = locale === "en" ? seed : localizedSeed[locale];
    if (!source) {
      console.error(`Missing localized seed for ${locale}.`);
      process.exit(1);
    }
    result[locale] = {
      siteSettings: 1,
      homePage: 1,
      productCategory: source.productCategories.length,
      product: source.products.length,
      solution: source.solutions.length,
      project: source.projects.length,
      blogPost: source.blogPosts.length,
      contentPage: source.pages.length,
    };
  }
  return result;
}

function expectedIntelligenceCounts(selectedLocales) {
  let total = 0;
  for (const locale of selectedLocales) {
    const source = locale === "en" ? seed : localizedSeed[locale];
    if (!source) {
      console.error(`Missing localized seed for ${locale}.`);
      process.exit(1);
    }
    total += 1; // siteSettings
    total += 1; // homePage
    total += source.productCategories.length;
    total += source.solutions.length;
    total += source.projects.length;
    total += source.pages.length;
  }
  return { faqs: total, evidence: total };
}

function countByLocaleAndType(rows, selectedLocales, types) {
  const result = {};
  for (const locale of selectedLocales) {
    result[locale] = {};
    for (const type of types) result[locale][type] = 0;
  }
  for (const row of rows) {
    if (result[row.language]) result[row.language][row._type] = (result[row.language][row._type] || 0) + 1;
  }
  return result;
}

function compareCounts(expectedValue, actualValue) {
  const failures = [];
  for (const [locale, typeCounts] of Object.entries(expectedValue)) {
    for (const [type, expectedCount] of Object.entries(typeCounts)) {
      const actualCount = actualValue[locale]?.[type] || 0;
      if (actualCount !== expectedCount) {
        failures.push({ locale, type, expected: expectedCount, actual: actualCount });
      }
    }
  }
  return failures;
}

function normalizeLocales(value) {
  const valid = ["en", "es", "pt", "fr", "de", "ja"];
  const locales = String(value)
    .split(",")
    .map((locale) => locale.trim())
    .filter(Boolean);
  const invalid = locales.filter((locale) => !valid.includes(locale));
  if (invalid.length) {
    console.error(`Invalid locale(s): ${invalid.join(", ")}`);
    process.exit(1);
  }
  return locales.length ? locales : valid;
}

async function writeReport(summary) {
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
}

function timestamp() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

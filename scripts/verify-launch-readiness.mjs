#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { loadEnvFile, parseArgs, sanityConfigFromEnv } from "./sanity-env.mjs";

await loadEnvFile();

const args = parseArgs(process.argv.slice(2));

const fetchBase = normalizeOrigin(args.base || args.baseUrl || args.fetchBase || process.env.LAUNCH_VERIFY_BASE || "http://127.0.0.1:3000");
const expectedOrigin = normalizeOrigin(
  args.expectedOrigin || args.expectedSiteUrl || args.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || fetchBase,
);
const reportPath = path.resolve(args.report || `reports/launch/launch-readiness-${timestamp()}.json`);
const legacyCsvPath = path.resolve(args.legacyCsv || "reports/launch/legacy-wordpress-urls-20260528T063320Z.csv");
const legacyLimit = parseLimit(args.legacyLimit ?? args.legacySample ?? 40);
const allowExternalPending = Boolean(args.allowExternalPending);
const sanityCorsConfirmed = Boolean(args.sanityCorsConfirmed);
const formSubmissionConfirmed = Boolean(args.formSubmissionConfirmed);
const richResultsConfirmed = Boolean(args.richResultsConfirmed);
const searchConsoleConfirmed = Boolean(args.searchConsoleConfirmed);

const locales = ["en", "es", "pt", "fr", "de", "ja"];
const prefixedLocales = ["es", "pt", "fr", "de", "ja"];
const requiredHreflangs = [...locales, "x-default"];
const forbiddenExternalScripts = [
  "https://libtx.leadscloud.com/xhltrackingwithchat.js",
  "https://libtx.leadscloud.com/Front-Form/buryForm/xhlform_NEW.js",
  "https://fetchip.leadscloud.com/",
];

const pageSamples = [
  {
    label: "home",
    path: "/",
    locale: "en",
    requiredJsonLd: ["Organization", "WebSite", "WebPage", "FAQPage"],
  },
  {
    label: "products",
    path: "/products",
    locale: "en",
    requiredJsonLd: ["Organization", "WebSite", "WebPage", "FAQPage"],
  },
  {
    label: "spanish products",
    path: "/es/products",
    locale: "es",
    requiredJsonLd: ["Organization", "WebSite", "WebPage", "FAQPage"],
  },
  {
    label: "contact",
    path: "/contact",
    locale: "en",
    requiredJsonLd: ["Organization", "WebSite", "ContactPage", "FAQPage"],
  },
  {
    label: "japanese contact",
    path: "/ja/contact",
    locale: "ja",
    requiredJsonLd: ["Organization", "WebSite", "ContactPage", "FAQPage"],
  },
  {
    label: "product detail",
    path: "/mirror/wall-mirror/modern-black-iron-bathroom-mirror-with-shelf",
    locale: "en",
    requiredJsonLd: ["Organization", "WebSite", "WebPage", "BreadcrumbList", "Product", "FAQPage"],
  },
  {
    label: "blog detail",
    path: "/news/canvas-art-a-perfect-addition-to-your-home-decor",
    locale: "en",
    requiredJsonLd: ["Organization", "WebSite", "WebPage", "BreadcrumbList", "BlogPosting", "FAQPage"],
  },
  {
    label: "solution detail",
    path: "/solutions/business-insights-trends",
    locale: "en",
    requiredJsonLd: ["Organization", "WebSite", "WebPage", "BreadcrumbList", "FAQPage"],
  },
  {
    label: "french solution detail",
    path: "/fr/solutions/design-engineering",
    locale: "fr",
    requiredJsonLd: ["Organization", "WebSite", "WebPage", "BreadcrumbList", "FAQPage"],
  },
  {
    label: "german solution detail",
    path: "/de/solutions/manufacturing-delivery",
    locale: "de",
    requiredJsonLd: ["Organization", "WebSite", "WebPage", "BreadcrumbList", "FAQPage"],
  },
  {
    label: "enquiry list",
    path: "/enquiry-list",
    locale: "en",
    requiredJsonLd: ["Organization", "WebSite", "WebPage"],
    requireSocial: false,
  },
];

const report = {
  generatedAt: new Date().toISOString(),
  fetchBase,
  expectedOrigin,
  checks: {},
  failures: [],
  externalPending: [],
  ready: false,
};

report.checks.robots = await checkRobots();
report.checks.sitemap = await checkSitemap();
report.checks.pages = await checkPages();
report.checks.legacyRedirects = await checkLegacyRedirects();
report.checks.sanityCors = await checkSanityCors();
report.checks.manualGates = checkManualGates();

const automatedChecks = [report.checks.robots, report.checks.sitemap, report.checks.pages, report.checks.legacyRedirects];
const externalChecks = [report.checks.sanityCors, report.checks.manualGates];
const automatedOk = automatedChecks.every((check) => check.ok);
const externalOk = externalChecks.every((check) => check.ok);
report.automatedOk = automatedOk;
report.externalOk = externalOk;
report.ready = automatedOk && externalOk;

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

const summary = {
  ready: report.ready,
  automatedOk,
  externalOk,
  fetchBase,
  expectedOrigin,
  reportPath: path.relative(process.cwd(), reportPath),
  failures: report.failures.slice(0, 20),
  externalPending: report.externalPending,
};

console.log(JSON.stringify(summary, null, 2));

if (!automatedOk || (!externalOk && !allowExternalPending)) {
  process.exit(1);
}

async function checkRobots() {
  const response = await fetchText("/robots.txt");
  const text = response.text;
  const expectedSitemap = siteUrl("/sitemap.xml", expectedOrigin);
  const expectedHost = new URL(expectedOrigin).host;
  const checks = {
    status: response.status,
    hasUserAgent: /user-agent:\s*\*/i.test(text),
    allowsRoot: /allow:\s*\//i.test(text),
    disallowsStudio: /disallow:\s*\/studio\/?/i.test(text),
    hasExpectedSitemap: text.includes(expectedSitemap),
    hasExpectedHost:
      text.includes(`Host: ${expectedHost}`) ||
      text.includes(`host: ${expectedHost}`) ||
      text.includes(`Host: ${expectedOrigin}`) ||
      text.includes(`host: ${expectedOrigin}`),
  };
  const ok = response.status === 200 && Object.values(checks).every(Boolean);
  return finishCheck("robots", { ok, url: response.url, ...checks }, ok);
}

async function checkSitemap() {
  const response = await fetchText("/sitemap.xml");
  const locs = [...response.text.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => decodeXml(match[1]));
  const uniqueLocs = new Set(locs);
  const requiredPaths = ["/", "/products", "/es/products", "/contact", "/ja/contact"];
  const wrongOrigin = locs.filter((loc) => !loc.startsWith(`${expectedOrigin}/`) && loc !== `${expectedOrigin}/`);
  const queryOrHash = locs.filter((loc) => /[?#]/.test(loc));
  const missingRequired = requiredPaths.filter((item) => !uniqueLocs.has(siteUrl(item, expectedOrigin)));
  const expectedCount = parseInteger(args.expectedSitemapCount);
  const countMatches = expectedCount === undefined || uniqueLocs.size === expectedCount;
  const ok =
    response.status === 200 &&
    locs.length > 0 &&
    locs.length === uniqueLocs.size &&
    wrongOrigin.length === 0 &&
    queryOrHash.length === 0 &&
    missingRequired.length === 0 &&
    countMatches;

  return finishCheck(
    "sitemap",
    {
      ok,
      url: response.url,
      status: response.status,
      locCount: locs.length,
      uniqueLocCount: uniqueLocs.size,
      expectedCount,
      wrongOrigin: wrongOrigin.slice(0, 10),
      queryOrHash: queryOrHash.slice(0, 10),
      missingRequired,
    },
    ok,
  );
}

async function checkPages() {
  const samples = [];
  for (const sample of pageSamples) {
    const response = await fetchText(sample.path);
    const html = response.text;
    const canonicalPath = unlocalizedPath(sample.path);
    const metadata = parseMetadata(html);
    const jsonLdTypes = parseJsonLdTypes(html);
    const requiredAlternates = expectedAlternates(canonicalPath);
    const missingAlternates = requiredHreflangs.filter((lang) => !sameUrl(metadata.hreflangs[lang], requiredAlternates[lang]));
    const expectedCanonical = siteUrl(sample.path, expectedOrigin);
    const missingJsonLd = sample.requiredJsonLd.filter((type) => !jsonLdTypes.includes(type));
    const hasGtm = html.includes("GTM-NFFXV4DP");
    const hasGoogleVerification = html.includes("XxIbPVYkAfTn87yksZcHyjNaILrUXOCBthdp9uhcLr0");
    const decodedHtml = decodeHtml(html);
    const forbiddenScripts = forbiddenExternalScripts.filter((script) => decodedHtml.includes(script));
    const hasTitle = Boolean(metadata.title);
    const hasDescription = Boolean(metadata.description);
    const hasOg = Boolean(metadata.ogTitle && metadata.ogDescription && metadata.ogImage && metadata.ogImageAlt);
    const hasTwitter = Boolean(metadata.twitterCard && metadata.twitterImage);
    const socialOk = sample.requireSocial === false || (hasOg && hasTwitter);
    const ok =
      response.status === 200 &&
      metadata.htmlLang === sample.locale &&
      sameUrl(metadata.canonical, expectedCanonical) &&
      missingAlternates.length === 0 &&
      missingJsonLd.length === 0 &&
      forbiddenScripts.length === 0 &&
      hasGtm &&
      hasGoogleVerification &&
      hasTitle &&
      hasDescription &&
      socialOk;

    samples.push({
      label: sample.label,
      path: sample.path,
      url: response.url,
      status: response.status,
      expectedLocale: sample.locale,
      htmlLang: metadata.htmlLang,
      canonical: metadata.canonical,
      expectedCanonical,
      missingAlternates,
      jsonLdTypes,
      missingJsonLd,
      forbiddenScripts,
      hasGtm,
      hasGoogleVerification,
      hasTitle,
      hasDescription,
      hasOg,
      hasTwitter,
      requireSocial: sample.requireSocial !== false,
      ok,
    });
  }

  const ok = samples.every((sample) => sample.ok);
  return finishCheck("pages", { ok, checked: samples.length, samples }, ok);
}

async function checkLegacyRedirects() {
  if (args.skipLegacy) {
    return { ok: true, skipped: true, reason: "--skip-legacy was provided" };
  }
  if (!fs.existsSync(legacyCsvPath)) {
    return finishCheck(
      "legacyRedirects",
      { ok: false, csvPath: path.relative(process.cwd(), legacyCsvPath), error: "Legacy CSV not found" },
      false,
    );
  }

  const rows = readCsv(legacyCsvPath);
  const selectedRows = legacyLimit === undefined ? rows : rows.slice(0, legacyLimit);
  const results = [];

  for (const row of selectedRows) {
    const legacyPath = row.legacy_path;
    const suggestedPath = cleanPath(row.suggested_new_path || "/");
    const first = await fetchManual(legacyPath);
    const firstLocation = first.headers.get("location");
    let finalStatus = first.status;
    let finalUrl = first.url;

    if (firstLocation && isRedirectStatus(first.status)) {
      const nextUrl = new URL(firstLocation, fetchBase).toString();
      const final = await fetch(nextUrl, { redirect: "follow" });
      finalStatus = final.status;
      finalUrl = final.url;
      await final.arrayBuffer();
    } else {
      await first.arrayBuffer();
    }

    const redirectOk =
      (isRedirectStatus(first.status) && finalStatus === 200 && !isWordPressUtilityUrl(finalUrl)) ||
      (legacyPath === "/" && first.status === 200);

    results.push({
      legacyPath,
      suggestedPath,
      firstStatus: first.status,
      firstLocation,
      finalStatus,
      finalUrl,
      ok: redirectOk,
    });
  }

  const ok = results.every((item) => item.ok);
  return finishCheck(
    "legacyRedirects",
    {
      ok,
      csvPath: path.relative(process.cwd(), legacyCsvPath),
      checked: results.length,
      totalRows: rows.length,
      limited: legacyLimit !== undefined,
      failures: results.filter((item) => !item.ok).slice(0, 20),
    },
    ok,
  );
}

async function checkSanityCors() {
  const sanity = sanityConfigFromEnv(args);
  const expectedOriginWithoutSlash = expectedOrigin.replace(/\/+$/g, "");
  const token = process.env.SANITY_API_TOKEN || process.env.SANITY_API_READ_TOKEN;
  const check = {
    ok: false,
    projectId: sanity.projectId,
    dataset: sanity.dataset,
    expectedOrigin: expectedOriginWithoutSlash,
    confirmedByFlag: sanityCorsConfirmed,
    tokenPresent: Boolean(token),
    endpointStatus: undefined,
    matchingOrigin: false,
  };

  if (sanityCorsConfirmed) {
    check.ok = true;
    return check;
  }

  if (token) {
    try {
      const response = await fetch(`https://api.sanity.io/v2025-02-19/projects/${sanity.projectId}/cors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      check.endpointStatus = response.status;
      const text = await response.text();
      if (response.ok) {
        const json = JSON.parse(text);
        const origins = Array.isArray(json) ? json : Array.isArray(json?.origins) ? json.origins : Array.isArray(json?.items) ? json.items : [];
        check.origins = origins.map((item) => (typeof item === "string" ? item : item.origin || item.url)).filter(Boolean);
        check.matchingOrigin = check.origins.includes(expectedOriginWithoutSlash);
        check.ok = check.matchingOrigin;
      } else {
        check.error = safeJsonMessage(text) || `Sanity CORS endpoint returned ${response.status}`;
      }
    } catch (error) {
      check.error = error.message;
    }
  }

  if (!check.ok) {
    report.externalPending.push({
      check: "sanityCors",
      message:
        "Sanity CORS is not confirmed for the expected origin. Confirm it in Sanity project settings or rerun with --sanity-cors-confirmed after manual verification.",
    });
  }

  return finishCheck("sanityCors", check, check.ok, true);
}

function checkManualGates() {
  const gates = [
    {
      id: "formSubmission",
      ok: formSubmissionConfirmed,
      message:
        "A real Contact/product/enquiry HubSpot submission must be tested only after the owner confirms it is safe to send a test lead.",
    },
    {
      id: "richResults",
      ok: richResultsConfirmed,
      message: "Representative final-domain URLs must pass Google Rich Results validation or manual structured-data review.",
    },
    {
      id: "searchConsole",
      ok: searchConsoleConfirmed,
      message: "Google Search Console domain ownership and sitemap submission must be completed for the final domain.",
    },
  ];

  for (const gate of gates) {
    if (!gate.ok) report.externalPending.push({ check: gate.id, message: gate.message });
  }

  return finishCheck("manualGates", { ok: gates.every((gate) => gate.ok), gates }, gates.every((gate) => gate.ok), true);
}

function finishCheck(name, check, ok, external = false) {
  if (!ok) {
    const failure = { check: name, external, summary: summarizeFailure(check) };
    report.failures.push(failure);
  }
  return check;
}

function summarizeFailure(check) {
  if (check.error) return check.error;
  if (check.missingRequired?.length) return `Missing required URLs: ${check.missingRequired.join(", ")}`;
  if (check.wrongOrigin?.length) return `URLs with wrong origin: ${check.wrongOrigin.slice(0, 3).join(", ")}`;
  if (check.samples) {
    return check.samples
      .filter((sample) => !sample.ok)
      .slice(0, 3)
      .map((sample) => `${sample.path} failed`)
      .join("; ");
  }
  if (check.failures?.length) return `${check.failures.length} sampled legacy redirects failed`;
  return "Check failed";
}

async function fetchText(pagePath) {
  const response = await fetch(siteUrl(pagePath, fetchBase), { redirect: "follow" });
  const text = await response.text();
  return { status: response.status, url: response.url, text };
}

async function fetchManual(pagePath) {
  return fetch(siteUrl(pagePath, fetchBase), { redirect: "manual" });
}

function parseMetadata(html) {
  const linkTags = [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => match[0]);
  const metaTags = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => match[0]);
  const hreflangs = {};
  for (const tag of linkTags) {
    const rel = attr(tag, "rel");
    if (rel === "canonical") {
      hreflangs.canonical = attr(tag, "href");
    } else if (rel === "alternate") {
      const lang = attr(tag, "hreflang");
      const href = attr(tag, "href");
      if (lang && href) hreflangs[lang] = href;
    }
  }

  return {
    htmlLang: html.match(/<html[^>]*\slang=["']([^"']+)["']/i)?.[1] || null,
    title: decodeHtml(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || ""),
    description: metaContent(metaTags, "name", "description"),
    canonical: hreflangs.canonical || null,
    hreflangs,
    ogTitle: metaContent(metaTags, "property", "og:title"),
    ogDescription: metaContent(metaTags, "property", "og:description"),
    ogImage: metaContent(metaTags, "property", "og:image"),
    ogImageAlt: metaContent(metaTags, "property", "og:image:alt"),
    twitterCard: metaContent(metaTags, "name", "twitter:card"),
    twitterImage: metaContent(metaTags, "name", "twitter:image"),
  };
}

function metaContent(metaTags, key, value) {
  const tag = metaTags.find((item) => attr(item, key) === value);
  return tag ? attr(tag, "content") : null;
}

function parseJsonLdTypes(html) {
  const types = new Set();
  const scripts = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const script of scripts) {
    const body = decodeHtml(script[1].trim());
    if (!body) continue;
    try {
      collectJsonLdTypes(JSON.parse(body), types);
    } catch {
      types.add("__INVALID_JSON_LD__");
    }
  }
  return [...types].sort();
}

function collectJsonLdTypes(value, types) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectJsonLdTypes(item, types));
    return;
  }
  if (!value || typeof value !== "object") return;

  const type = value["@type"];
  if (Array.isArray(type)) type.forEach((item) => types.add(item));
  if (typeof type === "string") types.add(type);
  if (Array.isArray(value["@graph"])) value["@graph"].forEach((item) => collectJsonLdTypes(item, types));
}

function expectedAlternates(canonicalPath) {
  const result = {};
  for (const locale of locales) {
    result[locale] = siteUrl(localizePath(locale, canonicalPath), expectedOrigin);
  }
  result["x-default"] = siteUrl(localizePath("en", canonicalPath), expectedOrigin);
  return result;
}

function localizePath(locale, canonicalPath) {
  if (locale === "en") return canonicalPath;
  if (canonicalPath === "/") return `/${locale}`;
  return `/${locale}${canonicalPath}`;
}

function unlocalizedPath(pagePath) {
  for (const locale of prefixedLocales) {
    if (pagePath === `/${locale}`) return "/";
    if (pagePath.startsWith(`/${locale}/`)) return pagePath.slice(locale.length + 1) || "/";
  }
  return pagePath;
}

function attr(tag, name) {
  return tag.match(new RegExp(`\\s${name}=["']([^"']+)["']`, "i"))?.[1] || null;
}

function normalizeOrigin(value) {
  const raw = String(value || "").trim().replace(/\/+$/g, "");
  if (!raw) throw new Error("A base URL is required.");
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

function siteUrl(pagePath, origin) {
  const cleanOrigin = normalizeOrigin(origin);
  const normalizedPath = pagePath.startsWith("/") ? pagePath : `/${pagePath}`;
  if (normalizedPath === "/") return `${cleanOrigin}/`;
  return `${cleanOrigin}${normalizedPath}`;
}

function cleanPath(value) {
  if (!value) return "/";
  try {
    const url = new URL(value);
    return url.pathname || "/";
  } catch {
    return value.startsWith("/") ? value : `/${value}`;
  }
}

function normalizeUrlPath(value) {
  const url = new URL(value);
  return `${url.origin}${url.pathname.replace(/\/+$/g, "") || "/"}`;
}

function sameUrl(actual, expected) {
  if (!actual || !expected) return false;
  try {
    return normalizeUrlPath(actual) === normalizeUrlPath(expected);
  } catch {
    return actual === expected;
  }
}

function isWordPressUtilityUrl(value) {
  try {
    const url = new URL(value);
    return /^\/(wp-admin|wp-content|wp-includes|wp-json|xmlrpc\.php)\b/i.test(url.pathname);
  } catch {
    return false;
  }
}

function isRedirectStatus(status) {
  return [301, 302, 303, 307, 308].includes(status);
}

function parseLimit(value) {
  if (value === undefined || value === "all") return undefined;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return 40;
  return Math.floor(number);
}

function parseInteger(value) {
  if (value === undefined || value === true) return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? Math.floor(number) : undefined;
}

function readCsv(filePath) {
  const raw = fs.readFileSync(filePath, "utf8").trim();
  const [headerLine, ...lines] = raw.split(/\r?\n/);
  const headers = parseCsvLine(headerLine);
  return lines.filter(Boolean).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
  });
}

function parseCsvLine(line) {
  const values = [];
  let value = "";
  let inQuotes = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"' && line[index + 1] === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(value);
      value = "";
    } else {
      value += char;
    }
  }
  values.push(value);
  return values;
}

function decodeXml(value) {
  return decodeHtml(value);
}

function decodeHtml(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function safeJsonMessage(text) {
  try {
    const json = JSON.parse(text);
    return json.message || json.error || undefined;
  } catch {
    return undefined;
  }
}

function timestamp() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "Z");
}

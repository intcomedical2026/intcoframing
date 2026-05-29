import fs from "node:fs";

const args = parseArgs(process.argv.slice(2));
const baseUrl = args.baseUrl || "http://127.0.0.1:3001";
const dataset = args.dataset || "staging";
const reportPath = args.report || `reports/launch/${dataset}-frontend-smoke-20260528.json`;
const probePath = args.probe || (dataset === "staging" ? "reports/launch/staging-frontend-probe-20260528.json" : undefined);

const samples = [
  { path: "/", locale: "en" },
  { path: "/es", locale: "es" },
  { path: "/pt/products", locale: "pt" },
  { path: "/fr/solutions/design-engineering", locale: "fr" },
  { path: "/de/contact", locale: "de" },
  { path: "/ja/news/the-major-materials-of-medicine-mirror-cabinet", locale: "ja" },
  { path: "/mirror/led-mirror/classic-led-mirror", locale: "en" },
  { path: "/es/mirror/led-mirror/classic-led-mirror", locale: "es" },
  { path: "/pt/projects", locale: "pt" },
  { path: "/fr/blog", locale: "fr" },
  { path: "/de/memo-board", locale: "de" },
  { path: "/ja/art/canvas-art", locale: "ja" },
];

const probe = probePath && fs.existsSync(probePath) ? JSON.parse(fs.readFileSync(probePath, "utf8")) : undefined;
const results = [];

for (const sample of samples) {
  const url = `${baseUrl}${sample.path}`;
  const response = await fetch(url);
  const html = await response.text();
  const lang = html.match(/<html[^>]* lang="([^"]+)"/)?.[1] || null;
  const linkTags = [...html.matchAll(/<link[^>]+>/g)].map((match) => match[0]);
  const canonicalTag = linkTags.find((tag) => attr(tag, "rel") === "canonical");
  const canonical = canonicalTag ? attr(canonicalTag, "href") : null;
  const alternates = linkTags
    .filter((tag) => attr(tag, "rel") === "alternate")
    .map((tag) => ({ hreflang: attr(tag, "hreflang"), href: attr(tag, "href") }));
  const markerFound = probe ? html.includes(probe.marker) : false;

  results.push({
    path: sample.path,
    status: response.status,
    expectedLocale: sample.locale,
    htmlLang: lang,
    canonical,
    alternateCount: alternates.length,
    hasXDefault: alternates.some((item) => item.hreflang === "x-default"),
    markerFound,
    ok:
      response.status === 200 &&
      lang === sample.locale &&
      alternates.length >= 7 &&
      alternates.some((item) => item.hreflang === "x-default") &&
      !markerFound,
  });
}

const report = {
  dataset,
  baseUrl,
  probePath,
  generatedAt: new Date().toISOString(),
  samples: results,
  ok: results.every((item) => item.ok),
};

fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

console.log(
  JSON.stringify(
    {
      ok: report.ok,
      checked: results.length,
      failures: results.filter((item) => !item.ok),
    },
    null,
    2,
  ),
);

if (!report.ok) process.exit(1);

function attr(tag, name) {
  return tag.match(new RegExp(`${name}=["']([^"']+)["']`, "i"))?.[1] || null;
}

function parseArgs(values) {
  const parsed = {};
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (!value.startsWith("--") && !parsed.baseUrl) {
      parsed.baseUrl = value;
    } else if (value === "--dataset") {
      parsed.dataset = values[index + 1];
      index += 1;
    } else if (value.startsWith("--dataset=")) {
      parsed.dataset = value.slice("--dataset=".length);
    } else if (value === "--report") {
      parsed.report = values[index + 1];
      index += 1;
    } else if (value.startsWith("--report=")) {
      parsed.report = value.slice("--report=".length);
    } else if (value === "--probe") {
      parsed.probe = values[index + 1];
      index += 1;
    } else if (value.startsWith("--probe=")) {
      parsed.probe = value.slice("--probe=".length);
    } else if (value === "--no-probe") {
      parsed.probe = undefined;
    }
  }
  return parsed;
}

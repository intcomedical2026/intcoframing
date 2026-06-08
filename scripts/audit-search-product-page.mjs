import { execFile } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const sourceOrigin = "https://www.intcoframing-us.com";
const localOrigin = "http://127.0.0.1:3000";

function slugFromPath(productPath) {
  return productPath.replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
}

function textFromHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchAllText(html, pattern) {
  return [...html.matchAll(pattern)].map((match) => match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()).filter(Boolean);
}

function inspectHtml(html) {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, " ").trim() || null;
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() || null;
  const h2 = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i)?.[1]?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() || null;
  const text = textFromHtml(html);
  const headings = [
    ...matchAllText(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi),
    ...matchAllText(html, /<h2[^>]*>([\s\S]*?)<\/h2>/gi),
    ...matchAllText(html, /<h3[^>]*>([\s\S]*?)<\/h3>/gi),
  ].slice(0, 20);
  return {
    title,
    h1,
    h2,
    headings,
    textLength: text.length,
    imgTagCount: (html.match(/<img\b/gi) || []).length,
    formMarkerCount: (html.match(/<form\b|BURY_CODE_|leadscloud|XHLFORM/gi) || []).length,
    hasCategories: /Categories|Wall Mirror|LED Mirror|Products1-title/i.test(text),
    hasBestSellers: /BEST SELLERS|Best Sellers/i.test(text),
    hasSpecs: /Item#|Item No|Color|Size|Material|Description/i.test(text),
    textStart: text.slice(0, 1200),
  };
}

async function dumpDom(url) {
  const { stdout } = await execFileAsync(
    chromePath,
    [
      "--headless=new",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--hide-scrollbars",
      "--virtual-time-budget=3000",
      "--dump-dom",
      url,
    ],
    { maxBuffer: 20 * 1024 * 1024, timeout: 45000 },
  );
  return stdout;
}

async function screenshot(url, filePath, size) {
  await execFileAsync(
    chromePath,
    [
      "--headless=new",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--hide-scrollbars",
      `--window-size=${size}`,
      `--screenshot=${filePath}`,
      url,
    ],
    { maxBuffer: 1024 * 1024, timeout: 45000 },
  );
}

async function auditSide(kind, url, outDir) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  const html = await dumpDom(url);
  const sideDir = path.join(outDir, kind);
  await mkdir(sideDir, { recursive: true });
  await writeFile(path.join(sideDir, "dom.html"), html);
  await writeFile(path.join(sideDir, "text.txt"), textFromHtml(html));
  await screenshot(url, path.join(sideDir, "viewport.png"), "1920,1080");
  await screenshot(url, path.join(sideDir, "long.png"), "1920,5200");

  return {
    kind,
    url,
    status: response.status,
    ...inspectHtml(html),
    screenshots: {
      viewport: path.join(sideDir, "viewport.png"),
      long: path.join(sideDir, "long.png"),
    },
  };
}

async function main() {
  const productPath = process.argv[2];
  const index = process.argv[3] || "001";
  const expectedTitle = process.argv.slice(4).join(" ");

  if (!productPath) {
    throw new Error("Usage: node scripts/audit-search-product-page.mjs <productPath> <index> <expectedTitle>");
  }

  const slug = `${String(index).padStart(3, "0")}-${slugFromPath(productPath).split("-").slice(-4).join("-")}`;
  const outDir = path.join("reports", "visual-parity", "search-product-pages", slug);
  await mkdir(outDir, { recursive: true });

  const sourceUrl = `${sourceOrigin}${productPath.replace(/\/$/, "")}/`;
  const localUrl = `${localOrigin}${productPath}`;
  const source = await auditSide("original", sourceUrl, outDir);
  const local = await auditSide("current", localUrl, outDir);

  const audit = {
    product: {
      index: Number(index),
      title: expectedTitle || null,
      path: productPath,
      sourceUrl,
      localUrl,
    },
    capturedAt: new Date().toISOString(),
    source,
    local,
    initialDifferences: {
      statusMismatch: source.status !== local.status,
      titleMismatch: source.title !== local.title,
      h1Mismatch: (source.h1 || source.h2) !== (local.h1 || local.h2),
      sourceHasCategories: source.hasCategories,
      localHasCategories: local.hasCategories,
      sourceHasBestSellers: source.hasBestSellers,
      localHasBestSellers: local.hasBestSellers,
      sourceHasSpecs: source.hasSpecs,
      localHasSpecs: local.hasSpecs,
    },
  };

  const auditPath = path.join(outDir, "audit.json");
  await writeFile(auditPath, JSON.stringify(audit, null, 2));
  console.log(JSON.stringify({ auditPath, outDir, product: audit.product, source: source.status, local: local.status, differences: audit.initialDifferences }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

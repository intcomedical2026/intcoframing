#!/usr/bin/env node

import dns from "node:dns/promises";
import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "./sanity-env.mjs";

const args = parseArgs(process.argv.slice(2));

const domain = String(args.domain || args.host || "www.intcoframing-us.com").replace(/^https?:\/\//i, "").replace(/\/.*$/g, "");
const expectedOrigin = normalizeOrigin(args.expectedOrigin || args.siteUrl || `https://${domain}`);
const expectedSitemapCount = parseInteger(args.expectedSitemapCount || 1476);
const reportPath = path.resolve(args.report || `reports/launch/domain-cutover-${timestamp()}.json`);
const allowFail = Boolean(args.allowFail);

const report = {
  generatedAt: new Date().toISOString(),
  domain,
  expectedOrigin,
  expectedSitemapCount,
  dns: await checkDns(domain),
  http: {},
  leadsCloud: await checkLeadsCloud(domain),
  conclusions: [],
  ok: false,
};

report.http.home = await fetchText(`${expectedOrigin}/`);
report.http.robots = await fetchText(`${expectedOrigin}/robots.txt`);
report.http.sitemap = await fetchText(`${expectedOrigin}/sitemap.xml`);

const homeHtml = report.http.home.body || "";
const robotsText = report.http.robots.body || "";
const sitemapText = report.http.sitemap.body || "";
const sitemapLocCount = [...sitemapText.matchAll(/<loc>/g)].length;

report.fingerprint = {
  homeStatus: report.http.home.status,
  homeServer: header(report.http.home.headers, "server"),
  homeContentType: header(report.http.home.headers, "content-type"),
  xVercelId: header(report.http.home.headers, "x-vercel-id"),
  xMatchedPath: header(report.http.home.headers, "x-matched-path"),
  hasNextStatic: /\/_next\//i.test(homeHtml),
  hasNextFlight: /self\.__next_f|__nextjs|next-route/i.test(homeHtml),
  hasWordPressAssets: /\/wp-content\/|\/wp-includes\//i.test(homeHtml),
  hasWordPressGenerator: /wordpress/i.test(homeHtml),
  robotsStatus: report.http.robots.status,
  robotsHasExpectedSitemap: robotsText.includes(`${expectedOrigin}/sitemap.xml`),
  robotsHasWordPressSitemap: /wp-sitemap\.xml/i.test(robotsText),
  sitemapStatus: report.http.sitemap.status,
  sitemapLocCount,
  sitemapLooksLikeXml: /^\s*<\?xml|<urlset|<sitemapindex/i.test(sitemapText),
  sitemapLooksLikeOld404Html: /<title>\s*404\s*<\/title>|<h3>\s*404\s*<\/h3>/i.test(sitemapText),
};

report.conclusions = buildConclusions(report);
report.ok = report.conclusions.every((item) => item.ok);

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

const summary = {
  ok: report.ok,
  domain,
  expectedOrigin,
  reportPath: path.relative(process.cwd(), reportPath),
  conclusions: report.conclusions,
};

console.log(JSON.stringify(summary, null, 2));

if (!report.ok && !allowFail) process.exit(1);

async function checkDns(host) {
  const result = {
    cname: [],
    a: [],
    aaaa: [],
    nsRoot: [],
    errors: {},
    vercelLikely: false,
    cloudflareLikely: false,
  };

  const root = host.split(".").slice(-2).join(".");

  await assignDns(result, "cname", () => dns.resolveCname(host));
  await assignDns(result, "a", () => dns.resolve4(host));
  await assignDns(result, "aaaa", () => dns.resolve6(host));
  await assignDns(result, "nsRoot", () => dns.resolveNs(root));

  result.vercelLikely =
    result.cname.some((item) => /vercel-dns\.com|vercel\.app$/i.test(item)) ||
    result.a.includes("76.76.21.21");
  result.cloudflareLikely =
    result.nsRoot.some((item) => /cloudflare\.com$/i.test(item)) ||
    result.a.some((item) => isCloudflareIpv4(item));

  return result;
}

async function assignDns(target, key, fn) {
  try {
    target[key] = await fn();
  } catch (error) {
    target.errors[key] = error.code || error.message;
  }
}

async function fetchText(url) {
  try {
    const response = await fetch(url, { redirect: "follow" });
    const body = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      url: response.url,
      headers: Object.fromEntries(response.headers.entries()),
      body: body.slice(0, 500000),
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      url,
      headers: {},
      body: "",
      error: error.message,
    };
  }
}

async function checkLeadsCloud(host) {
  const enterpriseId = "200365";
  const website = host.startsWith("www.") ? host.slice(4) : host;
  const body = new URLSearchParams({ orgId: enterpriseId, website });
  try {
    const response = await fetch("https://fetchip.leadscloud.com/visitor-chat/track/getStatus", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
    });
    const text = await response.text();
    const json = JSON.parse(text);
    const statusList = Array.isArray(json?.data?.statusList) ? json.data.statusList : [];
    return {
      ok: response.status === 200 && json.code === 1 && statusList.some((item) => Number(item.useStatus) === 1),
      enterpriseId,
      website,
      status: response.status,
      statusListLength: statusList.length,
      statusList: statusList.map((item) => ({
        orgId: item.orgId,
        useStatus: item.useStatus,
        matomoSiteId: item.matomoSiteId,
        container: item.container,
      })),
    };
  } catch (error) {
    return {
      ok: false,
      enterpriseId,
      website,
      error: error.message,
    };
  }
}

function buildConclusions(data) {
  const fingerprint = data.fingerprint;
  return [
    {
      id: "dns_or_proxy_points_to_vercel",
      ok: Boolean(data.dns.vercelLikely || (fingerprint.xVercelId && !fingerprint.hasWordPressAssets)),
      detail: data.dns.vercelLikely
        ? "DNS directly indicates Vercel."
        : fingerprint.xVercelId
          ? "HTTP response includes Vercel headers."
          : "No direct DNS or HTTP Vercel signal found.",
    },
    {
      id: "home_serves_refreshed_next_site",
      ok: fingerprint.homeStatus === 200 && (fingerprint.hasNextStatic || fingerprint.hasNextFlight) && !fingerprint.hasWordPressAssets,
      detail: `homeStatus=${fingerprint.homeStatus}, hasNextStatic=${fingerprint.hasNextStatic}, hasWordPressAssets=${fingerprint.hasWordPressAssets}`,
    },
    {
      id: "robots_points_to_new_sitemap",
      ok: fingerprint.robotsStatus === 200 && fingerprint.robotsHasExpectedSitemap && !fingerprint.robotsHasWordPressSitemap,
      detail: `robotsStatus=${fingerprint.robotsStatus}, expectedSitemap=${fingerprint.robotsHasExpectedSitemap}, wpSitemap=${fingerprint.robotsHasWordPressSitemap}`,
    },
    {
      id: "sitemap_is_new_multilingual_sitemap",
      ok:
        fingerprint.sitemapStatus === 200 &&
        fingerprint.sitemapLooksLikeXml &&
        fingerprint.sitemapLocCount === expectedSitemapCount &&
        !fingerprint.sitemapLooksLikeOld404Html,
      detail: `sitemapStatus=${fingerprint.sitemapStatus}, locCount=${fingerprint.sitemapLocCount}, expected=${expectedSitemapCount}`,
    },
    {
      id: "leadscloud_final_domain_enabled",
      ok: data.leadsCloud.ok,
      detail: `website=${data.leadsCloud.website}, statusListLength=${data.leadsCloud.statusListLength || 0}`,
    },
  ];
}

function header(headers, name) {
  return headers?.[name.toLowerCase()] || null;
}

function normalizeOrigin(value) {
  const raw = String(value || "").trim().replace(/\/+$/g, "");
  if (!raw) throw new Error("Expected origin is required.");
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

function parseInteger(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.floor(number) : undefined;
}

function isCloudflareIpv4(value) {
  const octets = value.split(".").map((item) => Number(item));
  if (octets.length !== 4 || octets.some((item) => !Number.isInteger(item))) return false;
  const ranges = [
    ["173.245.48.0", 20],
    ["103.21.244.0", 22],
    ["103.22.200.0", 22],
    ["103.31.4.0", 22],
    ["141.101.64.0", 18],
    ["108.162.192.0", 18],
    ["190.93.240.0", 20],
    ["188.114.96.0", 20],
    ["197.234.240.0", 22],
    ["198.41.128.0", 17],
    ["162.158.0.0", 15],
    ["104.16.0.0", 13],
    ["104.24.0.0", 14],
    ["172.64.0.0", 13],
    ["131.0.72.0", 22],
  ];
  const ip = ipv4ToNumber(value);
  return ranges.some(([base, bits]) => {
    const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
    return (ip & mask) === (ipv4ToNumber(base) & mask);
  });
}

function ipv4ToNumber(value) {
  return value.split(".").reduce((sum, item) => ((sum << 8) + Number(item)) >>> 0, 0);
}

function timestamp() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "Z");
}

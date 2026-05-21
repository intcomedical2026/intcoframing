import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import net from "node:net";

const ROOT = process.cwd();
const PARITY_ROOT = path.join(ROOT, ".omx", "intco-parity");
const SCREENSHOT_ROOT = path.join(ROOT, "reports", "intco-parity", "screenshots");
const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900, mobile: false },
  { name: "mobile", width: 390, height: 844, mobile: true },
];

function parseArgs(argv) {
  const args = { base: "http://127.0.0.1:3000", manifest: path.join(PARITY_ROOT, "canonical-manifest.json") };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--all") args.all = true;
    else if (arg === "--batch") args.batch = argv[++index];
    else if (arg === "--entry") args.entry = argv[++index];
    else if (arg === "--limit") args.limit = Number(argv[++index]);
    else if (arg === "--offset") args.offset = Number(argv[++index]);
    else if (arg === "--base") args.base = argv[++index];
    else if (arg === "--manifest") args.manifest = argv[++index];
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!args.all && !args.batch && !args.entry && !args.limit) {
    throw new Error("Use --all, --batch, --entry, or --limit to make the screenshot scope explicit.");
  }
  return args;
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function writeJson(filePath, payload) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function filterEntries(entries, args) {
  let result = entries;
  if (args.batch) result = result.filter((entry) => entry.batch === args.batch);
  if (args.entry) result = result.filter((entry) => entry.entryId === args.entry);
  if (Number.isFinite(args.offset)) result = result.slice(args.offset);
  if (Number.isFinite(args.limit)) result = result.slice(0, args.limit);
  return result;
}

function fullUrl(base, routePath) {
  return new URL(routePath, base).toString();
}

function chromeCandidates() {
  return [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  ].filter(Boolean);
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function chromePath() {
  for (const candidate of chromeCandidates()) {
    if (await exists(candidate)) return candidate;
  }
  throw new Error("Chrome or Edge executable was not found. Set CHROME_PATH to the browser executable.");
}

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      server.close(() => resolve(port));
    });
  });
}

async function waitForJson(url, timeoutMs = 10000) {
  const started = Date.now();
  let lastError;
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await delay(150);
  }
  throw lastError || new Error(`Timed out waiting for ${url}`);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class CdpClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 0;
    this.pending = new Map();
    this.events = new Map();
  }

  async open() {
    await new Promise((resolve, reject) => {
      this.ws.addEventListener("open", resolve, { once: true });
      this.ws.addEventListener("error", reject, { once: true });
    });
    this.ws.addEventListener("message", (event) => this.handleMessage(event));
  }

  handleMessage(event) {
    const payload = JSON.parse(event.data);
    if (payload.id && this.pending.has(payload.id)) {
      const { resolve, reject } = this.pending.get(payload.id);
      this.pending.delete(payload.id);
      if (payload.error) reject(new Error(payload.error.message || JSON.stringify(payload.error)));
      else resolve(payload.result || {});
      return;
    }
    if (payload.method && this.events.has(payload.method)) {
      const listeners = this.events.get(payload.method);
      listeners.splice(0).forEach((listener) => listener(payload.params || {}));
    }
  }

  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });
  }

  waitEvent(method, timeoutMs = 10000) {
    return new Promise((resolve) => {
      const timer = setTimeout(() => resolve(null), timeoutMs);
      const listeners = this.events.get(method) || [];
      listeners.push((params) => {
        clearTimeout(timer);
        resolve(params);
      });
      this.events.set(method, listeners);
    });
  }

  close() {
    this.ws.close();
  }
}

async function startChrome() {
  const executable = await chromePath();
  const port = await freePort();
  const userDataDir = await fs.mkdtemp(path.join(os.tmpdir(), "intco-cdp-"));
  const chrome = spawn(executable, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    "about:blank",
  ], { stdio: "ignore" });
  await waitForJson(`http://127.0.0.1:${port}/json/version`);
  return { chrome, port, userDataDir };
}

async function openTarget(port) {
  const response = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" });
  if (!response.ok) throw new Error(`Unable to create Chrome target: HTTP ${response.status}`);
  const target = await response.json();
  const client = new CdpClient(target.webSocketDebuggerUrl);
  await client.open();
  await client.send("Page.enable");
  await client.send("Runtime.enable");
  return { target, client };
}

async function closeTarget(port, client, targetId) {
  client.close();
  await fetch(`http://127.0.0.1:${port}/json/close/${targetId}`).catch(() => null);
}

async function captureViewport(client, url, viewport, screenshotPath) {
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.mobile,
  });
  const loaded = client.waitEvent("Page.loadEventFired", 12000);
  await client.send("Page.navigate", { url });
  await loaded;
  await delay(1200);
  const dom = await client.send("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => {
      const headings = [...document.querySelectorAll("h1,h2,h3")].map((node) => ({
        level: node.tagName.toLowerCase(),
        text: node.textContent.trim().replace(/\\s+/g, " ")
      })).filter((item) => item.text).slice(0, 24);
      return {
        bodyTextLength: document.body.innerText.length,
        hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 2,
        headings,
        imageCount: document.images.length,
        scrollWidth: document.documentElement.scrollWidth,
        title: document.title,
        url: location.href,
        viewportHeight: window.innerHeight,
        viewportWidth: window.innerWidth
      };
    })()`,
  });
  const screenshot = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  await fs.writeFile(screenshotPath, Buffer.from(screenshot.data, "base64"));
  return dom.result?.value || {};
}

async function updateLedger(entryId, evidencePath) {
  const ledgerPath = path.join(PARITY_ROOT, "ledger.json");
  const ledger = await readJson(ledgerPath);
  const entry = ledger.entries.find((item) => item.entryId === entryId);
  if (!entry) throw new Error(`Ledger entry not found: ${entryId}`);
  entry.checks = { ...(entry.checks || {}), browserScreenshots: "PASS" };
  entry.evidence = { ...(entry.evidence || {}), browserScreenshots: evidencePath };
  await writeJson(ledgerPath, ledger);
}

async function captureEntry({ entry, base, port }) {
  const url = fullUrl(base, entry.canonicalPath);
  const evidencePath = path.join(PARITY_ROOT, "browser-evidence", `${entry.entryId}.json`);
  const { target, client } = await openTarget(port);
  const captures = [];
  const errors = [];
  try {
    for (const viewport of VIEWPORTS) {
      const screenshotPath = path.join(SCREENSHOT_ROOT, `${entry.entryId}-${viewport.name}.png`);
      await fs.mkdir(path.dirname(screenshotPath), { recursive: true });
      try {
        const dom = await captureViewport(client, url, viewport, screenshotPath);
        captures.push({
          name: viewport.name,
          width: viewport.width,
          height: viewport.height,
          screenshot: path.resolve(screenshotPath),
          dom,
        });
      } catch (error) {
        errors.push({ viewport: viewport.name, message: error.message });
      }
    }
  } finally {
    await closeTarget(port, client, target.id);
  }

  const checks = {
    desktopScreenshot: captures.some((item) => item.name === "desktop"),
    mobileScreenshot: captures.some((item) => item.name === "mobile"),
    headingsPresent: captures.every((item) => item.dom.headings?.length > 0),
    imagesPresent: captures.every((item) => item.dom.imageCount > 0),
    noHorizontalOverflow: captures.every((item) => item.dom.hasHorizontalOverflow === false),
  };
  const evidence = {
    entryId: entry.entryId,
    path: entry.canonicalPath,
    url,
    capturedAt: new Date().toISOString(),
    method: "Chrome CDP viewport screenshots",
    captures,
    errors,
    checks,
  };
  await writeJson(evidencePath, evidence);
  const ok = Object.values(checks).every(Boolean) && errors.length === 0;
  if (ok) await updateLedger(entry.entryId, path.relative(ROOT, evidencePath).replaceAll(path.sep, "/"));
  return { ok, evidence };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const manifest = await readJson(args.manifest);
  const entries = filterEntries(manifest, args);
  const { chrome, port, userDataDir } = await startChrome();
  const failures = [];
  try {
    for (let index = 0; index < entries.length; index += 1) {
      const entry = entries[index];
      const { ok, evidence } = await captureEntry({ entry, base: args.base, port });
      if (!ok) failures.push({ entryId: entry.entryId, path: entry.canonicalPath, checks: evidence.checks, errors: evidence.errors });
      console.log(`[${index + 1}/${entries.length}] ${entry.entryId} browser-screenshots=${ok ? "PASS" : "FAIL"}`);
    }
  } finally {
    chrome.kill();
    if (userDataDir.startsWith(os.tmpdir())) {
      await fs.rm(userDataDir, { recursive: true, force: true }).catch(() => null);
    }
  }
  await writeJson(path.join(PARITY_ROOT, "browser-screenshot-failures.json"), failures);
  if (failures.length) {
    console.error(JSON.stringify({ failures }, null, 2));
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import { createClient } from "@sanity/client";
import fs from "node:fs/promises";
import path from "node:path";
import { loadEnvFile, parseArgs, requireToken, sanityConfigFromEnv } from "./sanity-env.mjs";

await loadEnvFile(".env.local");

const args = parseArgs(process.argv.slice(2));
const { projectId, dataset, apiVersion } = sanityConfigFromEnv(args);
const token = requireToken(process.env.SANITY_API_TOKEN, "SANITY_API_TOKEN");
const aclMode = args.acl || args.aclMode || "public";
const reportPath = path.resolve(args.report || `reports/launch/sanity-dataset-${dataset}-${timestamp()}.json`);

if (!["public", "private", "custom"].includes(aclMode)) {
  console.error(`Invalid ACL mode: ${aclMode}`);
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

try {
  const datasets = await tryListDatasets();
  const existing = datasets?.find((item) => item.name === dataset || item.datasetName === dataset);
  const result = existing
    ? { action: "exists", dataset: existing.name || existing.datasetName, aclMode: existing.aclMode }
    : await createDataset();

  const summary = {
    projectId,
    dataset,
    apiVersion,
    ok: true,
    requestedAclMode: aclMode,
    result,
    availableDatasets: datasets ? normalizeDatasets(await tryListDatasets({ allowFailure: true })) : undefined,
  };

  await writeReport(summary);

  console.log(`${result.action === "created" ? "Created" : "Confirmed"} Sanity dataset ${projectId}/${dataset}.`);
  console.log(`Wrote dataset report to ${reportPath}`);
} catch (error) {
  const summary = {
    projectId,
    dataset,
    apiVersion,
    ok: false,
    requestedAclMode: aclMode,
    error: {
      message: error.message,
      statusCode: error.statusCode,
      traceId: error.traceId,
      responseMessage: error.response?.body?.message,
    },
  };
  await writeReport(summary);
  console.error(`Could not ensure Sanity dataset ${projectId}/${dataset}: ${summary.error.responseMessage || error.message}`);
  console.error(`Wrote dataset report to ${reportPath}`);
  process.exit(1);
}

async function tryListDatasets(options = {}) {
  try {
    return await client.datasets.list();
  } catch (error) {
    const message = error.response?.body?.message || error.message || "";
    if (options.allowFailure || /datasets\/read/.test(message)) return undefined;
    throw error;
  }
}

async function createDataset() {
  try {
    return { action: "created", ...(await client.datasets.create(dataset, { aclMode })) };
  } catch (error) {
    const message = error.response?.body?.message || error.message || "";
    if (error.statusCode === 409 || /already exists|duplicate|conflict/i.test(message)) {
      return {
        action: "exists-unconfirmed",
        dataset,
        aclMode: "unknown",
        note: "Dataset list permission is unavailable, but create reported that the dataset already exists.",
      };
    }
    throw error;
  }
}

function normalizeDatasets(datasets) {
  return datasets?.map((item) => ({
    name: item.name || item.datasetName,
    aclMode: item.aclMode,
  }));
}

async function writeReport(summary) {
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
}

function timestamp() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

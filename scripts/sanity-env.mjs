import fs from "node:fs/promises";
import path from "node:path";

export async function loadEnvFile(filePath = ".env.local") {
  try {
    const raw = await fs.readFile(path.resolve(filePath), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const index = trimmed.indexOf("=");
      const key = trimmed.slice(0, index).trim();
      const value = unquoteEnvValue(trimmed.slice(index + 1).trim());
      if (key && process.env[key] === undefined) process.env[key] = value;
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

export function parseArgs(values) {
  const parsed = {};
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (!value.startsWith("--")) continue;
    const [rawKey, inlineValue] = value.slice(2).split("=", 2);
    const key = rawKey.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
    if (inlineValue !== undefined) {
      parsed[key] = inlineValue;
    } else if (values[index + 1] && !values[index + 1].startsWith("--")) {
      parsed[key] = values[index + 1];
      index += 1;
    } else {
      parsed[key] = true;
    }
  }
  return parsed;
}

export function sanityConfigFromEnv(args = {}) {
  return {
    projectId: args.projectId || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "vzcnnept",
    dataset:
      args.dataset ||
      process.env.SANITY_IMPORT_DATASET ||
      process.env.SANITY_TARGET_DATASET ||
      process.env.NEXT_PUBLIC_SANITY_DATASET ||
      "production",
    apiVersion: args.apiVersion || process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-20",
  };
}

export function requireToken(value, label) {
  if (!value || /placeholder|missing/i.test(value)) {
    console.error(`${label} is required.`);
    console.error("Put a Sanity token in .env.local or export it in the shell before running this command.");
    process.exit(1);
  }
  return value;
}

function unquoteEnvValue(value) {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

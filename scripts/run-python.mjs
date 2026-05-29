import { spawnSync } from "node:child_process";

const scriptArgs = process.argv.slice(2);

if (!scriptArgs.length) {
  console.error("Usage: node scripts/run-python.mjs <script.py> [args...]");
  process.exit(1);
}

const candidates = [
  { command: "python3", args: [] },
  { command: "python", args: [] },
  { command: "py", args: ["-3"] },
];

for (const candidate of candidates) {
  const result = spawnSync(candidate.command, [...candidate.args, ...scriptArgs], {
    stdio: "inherit",
  });

  if (result.error?.code === "ENOENT") continue;
  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  process.exit(result.status ?? 0);
}

console.error("No Python 3 executable found. Install Python 3 or add it to PATH.");
process.exit(1);

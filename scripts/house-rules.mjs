#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const repo = process.env.HOUSE_RULES_REPO ?? "git@github.com:MRdevX/house-rules.git";
const checkout = process.env.HOUSE_RULES_DIR ?? join(homedir(), ".house-rules");
const [command = "sync", ...args] = process.argv.slice(2);

if (!existsSync(checkout)) {
  execFileSync("git", ["clone", "--quiet", repo, checkout], { stdio: "inherit" });
} else if (!process.env.HOUSE_RULES_DIR) {
  execFileSync("git", ["-C", checkout, "pull", "--quiet", "--ff-only"], { stdio: "inherit" });
}

const projectArgs = command === "sync" ? [`--project=${root}`] : [];
execFileSync(process.execPath, [join(checkout, "bin/house-rules.mjs"), command, ...projectArgs, ...args], {
  stdio: "inherit",
});

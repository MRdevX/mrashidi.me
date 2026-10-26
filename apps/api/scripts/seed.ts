import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { ContentSchema } from "@mrashidi/types";
import { buildSeedStatements } from "./seed-sql.ts";

const SECTIONS = ["profile", "about", "experience", "education", "certificates", "skills", "projects", "knowledge"];
const FIXTURES_DIR = resolve(import.meta.dirname, "../../../packages/types/fixtures");

const { values } = parseArgs({
  options: {
    source: { type: "string", default: process.env.MR_DATA_DIR ?? FIXTURES_DIR },
    remote: { type: "boolean", default: false },
  },
});

const source = resolve(values.source);
const raw = Object.fromEntries(
  SECTIONS.map((section) => [section, JSON.parse(readFileSync(join(source, `${section}.json`), "utf8"))])
);
const parsed = ContentSchema.safeParse(raw);
if (!parsed.success) {
  console.error(`Content in ${source} is invalid:`);
  for (const issue of parsed.error.issues) {
    console.error(`  ${issue.path.join(".") || "(root)"}: ${issue.message}`);
  }
  process.exit(1);
}

const file = join(mkdtempSync(join(tmpdir(), "mrashidi-seed-")), "seed.sql");
writeFileSync(file, buildSeedStatements(parsed.data, new Date()).join("\n"));

console.log(`Seeding ${values.remote ? "remote" : "local"} D1 from ${source}`);
execFileSync(
  "pnpm",
  ["exec", "wrangler", "d1", "execute", "mrashidi-db", values.remote ? "--remote" : "--local", `--file=${file}`],
  { stdio: "inherit" }
);

const revalidateUrl = process.env.REVALIDATE_URL;
const revalidateSecret = process.env.REVALIDATE_SECRET;
if (values.remote && revalidateUrl && revalidateSecret) {
  const res = await fetch(revalidateUrl, { method: "POST", headers: { Authorization: `Bearer ${revalidateSecret}` } });
  console.log(`Revalidated the site content cache: ${res.status}`);
  if (!res.ok) {
    process.exit(1);
  }
} else if (values.remote) {
  console.log(
    "Set REVALIDATE_URL and REVALIDATE_SECRET to refresh the site now; otherwise it refreshes within an hour."
  );
}

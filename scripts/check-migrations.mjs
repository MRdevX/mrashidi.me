import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const migrationsDir = join(root, "apps/api/migrations");
const metaDir = join(migrationsDir, "meta");

const journal = JSON.parse(readFileSync(join(metaDir, "_journal.json"), "utf8"));
const journaledTags = new Set(journal.entries.map((entry) => entry.tag));
const sqlTags = readdirSync(migrationsDir)
  .filter((file) => file.endsWith(".sql"))
  .map((file) => file.replace(/\.sql$/, ""));
const metaFiles = new Set(readdirSync(metaDir));

const errors = [
  ...sqlTags.filter((tag) => !journaledTags.has(tag)).map((tag) => `Migration SQL not in journal: ${tag}.sql`),
  ...journal.entries.flatMap((entry) => {
    const snapshot = `${String(entry.idx).padStart(4, "0")}_snapshot.json`;
    return [
      ...(sqlTags.includes(entry.tag) ? [] : [`Journal entry missing SQL file: ${entry.tag}.sql`]),
      ...(metaFiles.has(snapshot) ? [] : [`Journal entry ${entry.tag} missing snapshot: ${snapshot}`]),
    ];
  }),
];

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`✗ ${error}`);
  }
  console.error("\nD1 migration journal is out of sync with SQL files. Run `pnpm --filter @mrashidi/api db:generate`.");
  process.exit(1);
}

console.log(`✓ ${sqlTags.length} migration(s) registered in journal with snapshots.`);

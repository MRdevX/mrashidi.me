#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const HASHES_FILE = join(root, "scripts", "personal-data-hashes.json");
// Names that are public on purpose: the owner's own company, sibling projects named in the docs, and clients who agreed to be named.
const PUBLIC_NAMES = new Set(["notable nomads", "targela", "r4zzle", "klt mühendislik"]);

// Generated from commit history, which keeps its old messages (DR-0006 leaves history as is).
const SKIPPED_FILES = new Set(["CHANGELOG.md", "pnpm-lock.yaml", "scripts/personal-data-hashes.json"]);
const LEGAL_SUFFIXES = new Set(["gmbh", "ag", "inc", "ltd", "llc", "co", "se", "bv", "srl"]);

const tokenize = (text) => text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
const digest = (phrase) => createHash("sha256").update(phrase).digest("hex");

function collectPhrases(dataDir) {
  const read = (name) => JSON.parse(readFileSync(join(dataDir, `${name}.json`), "utf8"));
  const experience = read("experience");
  const education = read("education");
  const projects = read("projects");
  const knowledge = read("knowledge");
  return [
    ...experience.map((role) => role.company),
    ...education.map((entry) => entry.institution),
    ...projects.flatMap((project) => (project.clientName ? [project.clientName] : [])),
    ...knowledge.extraProjects.map((project) => project.title),
  ]
    .flatMap((phrase) => {
      const words = tokenize(phrase);
      const bare = words.filter((word) => !LEGAL_SUFFIXES.has(word));
      return [words.join(" "), bare.join(" ")];
    })
    .filter((phrase) => phrase && !PUBLIC_NAMES.has(phrase));
}

function update(dataDir) {
  const phrases = [...new Set(collectPhrases(dataDir))];
  const entries = phrases.map((phrase) => ({ words: phrase.split(" ").length, sha256: digest(phrase) }));
  entries.sort((a, b) => a.sha256.localeCompare(b.sha256));
  writeFileSync(HASHES_FILE, `${JSON.stringify(entries, null, 2)}\n`);
  console.log(`Stored ${entries.length} phrase hashes in ${HASHES_FILE}`);
}

function check() {
  const entries = JSON.parse(readFileSync(HASHES_FILE, "utf8"));
  const hashes = new Set(entries.map((entry) => entry.sha256));
  const lengths = [...new Set(entries.map((entry) => entry.words))];
  const files = execFileSync("git", ["ls-files", "-z"], { cwd: root, encoding: "utf8" })
    .split("\0")
    .filter((file) => file && !SKIPPED_FILES.has(file));

  const hits = [];
  for (const file of files) {
    let text;
    try {
      text = readFileSync(join(root, file), "utf8");
    } catch {
      continue;
    }
    if (text.includes("\0")) {
      continue;
    }
    text.split("\n").forEach((line, index) => {
      const words = tokenize(line);
      for (const length of lengths) {
        for (let start = 0; start + length <= words.length; start += 1) {
          const hash = digest(words.slice(start, start + length).join(" "));
          if (hashes.has(hash)) {
            hits.push(`${file}:${index + 1} (phrase ${hash.slice(0, 8)})`);
          }
        }
      }
    });
  }

  if (hits.length > 0) {
    console.error("Personal data from mrashidi-data found in the public repo (DR-0006):");
    for (const hit of hits) {
      console.error(`  ${hit}`);
    }
    console.error("Move it to the private data repo, or derive it from the content API.");
    process.exit(1);
  }
  console.log(`✓ No personal data phrases in ${files.length} tracked files.`);
}

const [command, dataDir] = process.argv.slice(2);
if (command === "--update") {
  update(dataDir ?? join(root, "..", "mrashidi-data"));
} else {
  check();
}

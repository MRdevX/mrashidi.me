#!/usr/bin/env node
import { createHash } from "node:crypto";
import { access, lstat, readdir, readFile, readlink } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const PROJECT_SKILL_PREFIX = "mrashidi-";
const MIN_SKILL_DESCRIPTION_LENGTH = 40;
const SKILL_HOSTS = [".cursor", ".claude"];
const SKILL_HOST_TARGET = "../.agents/skills";
const HOUSE_RULES_LOCK = ".agents/house-rules.lock.json";
const HOUSE_RULES_IMPORT = "@.agents/house-rules.md";

const errors = [];

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function listMarkdown(dir) {
  if (!(await exists(join(root, dir)))) {
    return [];
  }
  const entries = await readdir(join(root, dir), { withFileTypes: true });
  return entries.filter((entry) => entry.isFile() && /\.mdc?$/.test(entry.name)).map((entry) => join(dir, entry.name));
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return null;
  }
  const fields = {};
  let key = null;
  for (const line of match[1].split("\n")) {
    const field = line.match(/^([a-z0-9-]+):\s*(.*)$/i);
    if (field) {
      key = field[1];
      fields[key] = /^[>|]-?$/.test(field[2].trim()) ? "" : field[2].trim();
    } else if (key && /^\s/.test(line)) {
      fields[key] = `${fields[key]} ${line.trim()}`.trim();
    }
  }
  return fields;
}

async function checkLinks(file) {
  const abs = join(root, file);
  const content = await readFile(abs, "utf8");
  for (const match of content.matchAll(/\]\(([^)\s]+)\)/g)) {
    const target = match[1].split("#")[0];
    if (!target || /^(https?:|mailto:)/.test(target)) {
      continue;
    }
    const resolved = resolve(dirname(abs), target);
    if (!(await exists(resolved))) {
      errors.push(`Broken link in ${file}: ${target} → ${relative(root, resolved)}`);
    }
  }
}

async function checkCursorRules(ruleFiles) {
  for (const file of ruleFiles) {
    const fm = parseFrontmatter(await readFile(join(root, file), "utf8"));
    if (!fm?.description) {
      errors.push(`Rule missing description in frontmatter: ${file}`);
    }
  }
}

async function checkSkills(skills) {
  if (skills.length === 0) {
    errors.push("No skills found under .agents/skills/");
  }
  for (const skill of skills) {
    const path = join(root, ".agents", "skills", skill, "SKILL.md");
    if (!(await exists(path))) {
      errors.push(`Missing skill: .agents/skills/${skill}/SKILL.md`);
      continue;
    }
    const fm = parseFrontmatter(await readFile(path, "utf8"));
    if (fm?.name !== skill) {
      errors.push(`Skill name must match its folder: ${skill} (frontmatter: ${fm?.name ?? "none"})`);
    }
    if (!fm?.description || fm.description.length < MIN_SKILL_DESCRIPTION_LENGTH) {
      errors.push(`Skill description missing or under ${MIN_SKILL_DESCRIPTION_LENGTH} chars: ${skill}`);
    }
    if (!skill.startsWith(PROJECT_SKILL_PREFIX)) {
      continue;
    }
    if (fm?.description && !/use when/i.test(fm.description)) {
      errors.push(`Skill description needs a "Use when" trigger: ${skill}`);
    }
    if (fm?.["disable-model-invocation"] !== "false") {
      errors.push(`Skill must set disable-model-invocation: false: ${skill}`);
    }
  }
}

async function checkHouseRules(skills) {
  const lockPath = join(root, HOUSE_RULES_LOCK);
  if (!(await exists(lockPath))) {
    errors.push(`Missing ${HOUSE_RULES_LOCK}: run pnpm house-rules:sync`);
    return;
  }
  const { files } = JSON.parse(await readFile(lockPath, "utf8"));
  for (const [file, hash] of Object.entries(files)) {
    const path = join(root, file);
    if (!(await exists(path))) {
      errors.push(`Vendored house file missing: ${file}: run pnpm house-rules:sync`);
      continue;
    }
    const actual = createHash("sha256")
      .update(await readFile(path))
      .digest("hex");
    if (actual !== hash) {
      errors.push(`Vendored house file edited: ${file}: change it in the house-rules repo, then pnpm house-rules:sync`);
    }
  }
  for (const skill of skills.filter((name) => name.startsWith("house-"))) {
    if (!files[`.agents/skills/${skill}/SKILL.md`]) {
      errors.push(`house-* skill not in ${HOUSE_RULES_LOCK}: ${skill}: add it upstream, then sync`);
    }
  }
  const agents = await readFile(join(root, "AGENTS.md"), "utf8");
  if (!agents.split("\n").some((line) => line.trim() === HOUSE_RULES_IMPORT)) {
    errors.push(`AGENTS.md must import the house rules on its own line: ${HOUSE_RULES_IMPORT}`);
  }
}

async function checkSkillHosts() {
  const expected = join(root, ".agents", "skills");
  for (const host of SKILL_HOSTS) {
    const link = join(root, host, "skills");
    const fix = `ln -sfn ${SKILL_HOST_TARGET} ${host}/skills`;
    let info;
    try {
      info = await lstat(link);
    } catch {
      errors.push(`Missing ${host}/skills: run ${fix}`);
      continue;
    }
    if (!info.isSymbolicLink() || resolve(dirname(link), await readlink(link)) !== expected) {
      errors.push(`${host}/skills must be a symlink to ${SKILL_HOST_TARGET}: run rm -rf ${host}/skills && ${fix}`);
    }
  }
}

const skillEntries = await readdir(join(root, ".agents", "skills"), { withFileTypes: true });
const skills = skillEntries
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
const ruleFiles = await listMarkdown(".cursor/rules");

await checkCursorRules(ruleFiles);
await checkSkills(skills);
await checkHouseRules(skills);
await checkSkillHosts();

const linkedFiles = [
  "AGENTS.md",
  ...ruleFiles,
  ".agents/house-rules.md",
  ...skills
    .filter((skill) => skill.startsWith(PROJECT_SKILL_PREFIX) || skill.startsWith("house-"))
    .map((skill) => `.agents/skills/${skill}/SKILL.md`),
  ...(await listMarkdown("docs/agent")),
  ...(await listMarkdown("docs/decisions")),
];
for (const file of linkedFiles) {
  await checkLinks(file);
}

if (errors.length > 0) {
  console.error("Agent tooling check failed:\n");
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log(`Agent tooling OK (${skills.length} skills, ${linkedFiles.length} files link-checked).`);

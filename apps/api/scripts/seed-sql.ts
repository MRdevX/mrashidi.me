import { type Content, projectSlug } from "@mrashidi/types";

const SECTION_KEYS = ["profile", "about", "education", "certificates", "skills", "knowledge"] as const;

const quote = (value: string) => `'${value.replaceAll("'", "''")}'`;
const json = (value: unknown) => quote(JSON.stringify(value));

export function buildSeedStatements(content: Content, now: Date): string[] {
  const updatedAt = Math.floor(now.getTime() / 1000);
  return [
    "DELETE FROM content_sections;",
    "DELETE FROM projects;",
    "DELETE FROM work_experience;",
    ...SECTION_KEYS.map(
      (key) =>
        `INSERT INTO content_sections (key, data, updated_at) VALUES (${quote(key)}, ${json(content[key])}, ${updatedAt});`
    ),
    ...content.projects.map(
      (project, position) =>
        `INSERT INTO projects (slug, position, data, updated_at) VALUES (${quote(projectSlug(project))}, ${position}, ${json(project)}, ${updatedAt});`
    ),
    ...content.experience.map(
      (role, position) =>
        `INSERT INTO work_experience (position, data, updated_at) VALUES (${position}, ${json(role)}, ${updatedAt});`
    ),
  ];
}

import {
  type CertificateCategory,
  type Education,
  type PersonalInfo,
  type SiteConfig,
  type SkillCategory,
  certificates as siteCertificates,
  config as siteConfig,
  education as siteEducation,
  personalInfo as sitePersonalInfo,
  skills as siteSkills,
  workExperience as siteWorkExperience,
  type WorkExperience,
} from "@/data";
import { type Project, projectSlug } from "@/features/projects/domain/project";
import { projects as siteProjects } from "@/features/projects/infrastructure/projectData";
import { type AskMrKnowledge, askMrKnowledge } from "./askMrKnowledge";

export interface KnowledgeSources {
  config: SiteConfig;
  personalInfo: PersonalInfo;
  workExperience: readonly WorkExperience[];
  skills: readonly SkillCategory[];
  certificates: readonly CertificateCategory[];
  education: readonly Education[];
  projects: readonly Project[];
  extra: AskMrKnowledge;
}

export const defaultKnowledgeSources: KnowledgeSources = {
  config: siteConfig,
  personalInfo: sitePersonalInfo,
  workExperience: siteWorkExperience,
  skills: siteSkills,
  certificates: siteCertificates,
  education: siteEducation,
  projects: siteProjects,
  extra: askMrKnowledge,
};

const filled = (value: string | undefined): value is string => Boolean(value?.trim());

const bullets = (items: readonly string[], indent = ""): string =>
  items
    .filter(filled)
    .map((item) => `${indent}- ${item.trim()}`)
    .join("\n");

const section = (title: string, body: string): string => (body.trim() ? `# ${title}\n${body.trim()}` : "");

const joinBlocks = (blocks: readonly string[], separator = "\n\n"): string => blocks.filter(filled).join(separator);

function profileSection({ config, personalInfo }: KnowledgeSources): string {
  const { person, social, site } = config;
  return section(
    "Profile",
    joinBlocks(
      [
        `Name: ${person.name}. Title: ${person.title}. Based in ${person.location}.`,
        `Website: ${person.website} · Email: ${person.email} · GitHub: ${social.github} · LinkedIn: ${social.linkedin} · Telegram: ${social.telegram} · Website source code: ${social.githubRepo}`,
        `Summary: ${site.description}`,
        `Bio (his own words): ${personalInfo.bio}`,
        `Contact note: ${personalInfo.contactDescription}`,
        `Spoken languages: ${personalInfo.languages.map((l) => `${l.language}: ${l.level}`).join("; ")}.`,
      ],
      "\n"
    )
  );
}

function experienceSection({ workExperience, extra }: KnowledgeSources): string {
  const roles = workExperience
    .filter((role) => !extra.hiddenRoles.includes(role.company))
    .map((role) => {
      const notes = extra.roleNotes.find((n) => n.company === role.company)?.highlights ?? [];
      const achievements = [...role.achievements, ...notes];
      return joinBlocks(
        [
          `## ${role.title} — ${role.company}`,
          `${role.period} · ${role.location} · ${role.employmentType}`,
          filled(role.summary) ? role.summary : "",
          role.stack?.length ? `Stack: ${role.stack.join(", ")}` : "",
          achievements.length ? bullets(achievements) : "No details published for this role yet.",
        ],
        "\n"
      );
    });
  return section("Work experience (newest first)", joinBlocks(roles));
}

function skillsSection({ skills, extra }: KnowledgeSources): string {
  const legend =
    "Levels: proficient = used in production or central to a role; experienced = shipped in a live project or older role; familiar = light use. No level means listed without a rating.";
  const lines = skills.map(
    ({ category, skills: items }) =>
      `- ${category}: ${items.map((s) => (s.level ? `${s.name} (${s.level})` : s.name)).join(", ")}`
  );
  const fromCv = extra.extraSkills.some(filled)
    ? `Also on his CV (no level given):\n${bullets(extra.extraSkills)}`
    : "";
  return section("Skills", joinBlocks([legend, lines.join("\n"), fromCv], "\n"));
}

function projectLine(project: Project): string {
  const kind =
    project.type === "client"
      ? `Client project${filled(project.clientName) ? ` for ${project.clientName}` : ""}`
      : "Personal project";
  const meta = [
    kind,
    project.year,
    filled(project.role) ? `Role: ${project.role}` : "",
    project.openSource ? "Open source" : project.visibility === "private" ? "Private" : "Public",
  ].filter(filled);
  return joinBlocks(
    [
      `## ${project.title} [slug: ${projectSlug(project)}]`,
      meta.join(" · "),
      project.description,
      project.highlights?.length ? bullets(project.highlights) : "",
      `Stack: ${project.stack.join(", ")}`,
      filled(project.githubUrl) ? `GitHub: ${project.githubUrl}` : "",
      filled(project.liveUrl) ? `Live: ${project.liveUrl}` : "",
    ],
    "\n"
  );
}

function projectsSection({ projects }: KnowledgeSources): string {
  return section(`Projects (${projects.length})`, joinBlocks(projects.map(projectLine)));
}

function extraProjectsSection({ extra }: KnowledgeSources): string {
  const blocks = extra.extraProjects.map((p) =>
    joinBlocks([`## ${p.title} (${p.year})`, p.summary, `Stack: ${p.stack.join(", ")}`], "\n")
  );
  return section("More projects from his CV (not on the projects page, so no project card)", joinBlocks(blocks));
}

function certificatesSection({ certificates }: KnowledgeSources): string {
  const lines = certificates.map(
    ({ category, certificates: items }) =>
      `- ${category}: ${items.map((c) => `${c.name} (${c.provider}, ${c.year})`).join("; ")}`
  );
  return section("Certificates", lines.join("\n"));
}

function educationSection({ education }: KnowledgeSources): string {
  const lines = education.map((e) =>
    joinBlocks(
      [`- ${e.degree}, ${e.institution}, ${e.location} (${e.period})`, e.details ? bullets(e.details, "  ") : ""],
      "\n"
    )
  );
  return section("Education", lines.join("\n"));
}

function extraSection({ extra }: KnowledgeSources): string {
  const labelled = (label: string, value: string) => (filled(value) ? `- ${label}: ${value.trim()}` : "");
  const list = (label: string, values: readonly string[]) =>
    values.some(filled) ? `${label}:\n${bullets(values, "  ")}` : "";

  return section(
    "Additional facts from Mahdi",
    joinBlocks(
      [
        joinBlocks(
          [
            labelled("Availability", extra.availability),
            labelled("Remote / hybrid", extra.remote),
            labelled("Relocation", extra.relocation),
            labelled("Work authorization", extra.workAuthorization),
          ],
          "\n"
        ),
        list("Preferred roles", extra.preferredRoles),
        list("Interests", extra.interests),
        list("Working style", extra.workingStyle),
        list("Fun facts", extra.funFacts),
        extra.faq
          .filter((f) => filled(f.question) && filled(f.answer))
          .map((f) => `Q: ${f.question.trim()}\nA: ${f.answer.trim()}`)
          .join("\n\n"),
      ],
      "\n"
    )
  );
}

/** Serializes everything Ask MR may know about Mahdi into one compact markdown block. */
export function buildKnowledge(sources: KnowledgeSources = defaultKnowledgeSources): string {
  return joinBlocks([
    profileSection(sources),
    experienceSection(sources),
    skillsSection(sources),
    projectsSection(sources),
    extraProjectsSection(sources),
    certificatesSection(sources),
    educationSection(sources),
    extraSection(sources),
  ]);
}

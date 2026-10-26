import {
  type About,
  type AskMrKnowledge,
  type CertificateCategory,
  type Education,
  firstName,
  type Profile,
  type ProjectEntry,
  type SkillCategory,
  type WorkExperience,
} from "@mrashidi/types";

export interface KnowledgeSources {
  profile: Profile;
  about: About;
  experience: readonly WorkExperience[];
  skills: readonly SkillCategory[];
  projects: readonly ProjectEntry[];
  certificates: readonly CertificateCategory[];
  education: readonly Education[];
  knowledge: AskMrKnowledge;
}

const filled = (value: string | undefined): value is string => Boolean(value?.trim());

const bullets = (items: readonly string[], indent = ""): string =>
  items
    .filter(filled)
    .map((item) => `${indent}- ${item.trim()}`)
    .join("\n");

const section = (title: string, body: string): string => (body.trim() ? `# ${title}\n${body.trim()}` : "");

const joinBlocks = (blocks: readonly string[], separator = "\n\n"): string => blocks.filter(filled).join(separator);

function profileSection({ profile, about }: KnowledgeSources): string {
  const { person, social, site } = profile;
  return section(
    "Profile",
    joinBlocks(
      [
        `Name: ${person.name}. Title: ${person.title}. Based in ${person.location}.`,
        `Website: ${person.website} · Email: ${person.email} · GitHub: ${social.github} · LinkedIn: ${social.linkedin} · Telegram: ${social.telegram} · Website source code: ${social.githubRepo}`,
        `Summary: ${site.description}`,
        `Bio (his own words): ${about.bio.map((segment) => segment.text).join("")}`,
        `Contact note: ${about.contactDescription}`,
        `Spoken languages: ${about.languages.map((l) => `${l.language}: ${l.level}`).join("; ")}.`,
      ],
      "\n"
    )
  );
}

function experienceSection({ experience, knowledge }: KnowledgeSources): string {
  const roles = experience
    .filter((role) => !knowledge.hiddenRoles.includes(role.company))
    .map((role) => {
      const notes = knowledge.roleNotes.find((n) => n.company === role.company)?.highlights ?? [];
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

function skillsSection({ skills, knowledge }: KnowledgeSources): string {
  const legend =
    "Levels: proficient = used in production or central to a role; experienced = shipped in a live project or older role; familiar = light use. No level means listed without a rating.";
  const lines = skills.map(
    ({ category, skills: items }) =>
      `- ${category}: ${items.map((s) => (s.level ? `${s.name} (${s.level})` : s.name)).join(", ")}`
  );
  const fromCv = knowledge.extraSkills.some(filled)
    ? `Also on his CV (no level given):\n${bullets(knowledge.extraSkills)}`
    : "";
  return section("Skills", joinBlocks([legend, lines.join("\n"), fromCv], "\n"));
}

function projectLine(project: ProjectEntry): string {
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
      `## ${project.title} [slug: ${project.slug}]`,
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

function extraProjectsSection({ knowledge }: KnowledgeSources): string {
  const blocks = knowledge.extraProjects.map((p) =>
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

function extraSection(sources: KnowledgeSources): string {
  const { knowledge: extra } = sources;
  const labelled = (label: string, value: string) => (filled(value) ? `- ${label}: ${value.trim()}` : "");
  const list = (label: string, values: readonly string[]) =>
    values.some(filled) ? `${label}:\n${bullets(values, "  ")}` : "";

  return section(
    `Additional facts from ${firstName(sources.profile)}`,
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

export function buildKnowledgeContext(sources: KnowledgeSources): string {
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

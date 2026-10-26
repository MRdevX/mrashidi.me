import type { SiteContent } from "@/lib/content";
import { AVAILABLE_COMMANDS, TERMINAL_COMMAND_CLICK_EVENT } from "./constants";
import { TerminalBadge, TerminalLink, TerminalListItem } from "./TerminalPrimitives";

const SKILL_CATEGORY_SEPARATOR = "-".repeat(40);
const ACHIEVEMENTS_PER_ROLE = 3;
const ACHIEVEMENT_ROLE_LIMIT = 2;
const CERTIFICATE_CATEGORY_LIMIT = 8;

export const SkillsByLevel = ({ skills }: Pick<SiteContent, "skills">) =>
  skills.map((cat) => {
    const skillsByLevel = {
      expert: cat.skills.filter((s) => s.level === "expert"),
      proficient: cat.skills.filter((s) => s.level === "proficient"),
      experienced: cat.skills.filter((s) => s.level === "experienced"),
      familiar: cat.skills.filter((s) => s.level === "familiar"),
      tools: cat.skills.filter((s) => !s.level),
    };

    return (
      <div key={cat.category}>
        <span className="text-orange-400">{cat.category}</span>
        {Object.entries(skillsByLevel).map(
          ([level, levelSkills]) =>
            levelSkills.length > 0 && (
              <div key={level} className="ml-2">
                <span className="text-green-400 capitalize">{level}: </span>
                <span className="text-gray-200">{levelSkills.map((s) => s.name).join(", ")}</span>
              </div>
            )
        )}
        <div className="text-gray-600">{SKILL_CATEGORY_SEPARATOR}</div>
      </div>
    );
  });

export const renderWorkExperience = ({ experience }: SiteContent, limit?: number) => {
  const experiences = limit ? experience.slice(0, limit) : experience;

  return experiences.map((exp) => (
    <div key={`${exp.title}-${exp.company}-${exp.period}`} className="mb-4">
      <p className="text-orange-500 font-bold">{exp.title}</p>
      <p className="text-green-400">{exp.company}</p>
      <p className="text-gray-400">
        • {exp.location} ({exp.employmentType})
      </p>
      <p className="text-gray-400">• {exp.period}</p>
      {exp.achievements.slice(0, ACHIEVEMENTS_PER_ROLE).map((achievement) => (
        <p key={`achievement-${achievement}`} className="text-gray-400">
          • {achievement}
        </p>
      ))}
    </div>
  ));
};

export const renderProjects = ({ projects }: SiteContent, limit?: number) => {
  const projectList = limit ? projects.slice(0, limit) : projects;

  return projectList.map((project) => (
    <div key={project.title} className="mb-4">
      <p className="text-orange-500 font-bold">{project.title}</p>
      <p className="text-gray-400">{project.description}</p>
      <p className="text-green-400 text-sm">Tech: {project.stack.join(", ")}</p>
      <div className="flex gap-2 text-xs mt-1 items-center">
        <TerminalBadge variant={project.visibility === "public" ? "public" : "private"}>
          {project.visibility}
        </TerminalBadge>
        <TerminalBadge variant={project.type === "personal" ? "personal" : "professional"}>
          {project.type}
        </TerminalBadge>
        {project.githubUrl && (
          <TerminalLink href={project.githubUrl} className="text-orange-400 underline">
            GitHub
          </TerminalLink>
        )}
        {project.liveUrl && (
          <TerminalLink href={project.liveUrl} className="text-green-400 underline">
            Live
          </TerminalLink>
        )}
      </div>
    </div>
  ));
};

export const renderContactInfo = ({ profile, about }: SiteContent) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <span className="text-orange-500">Email:</span>
      <TerminalLink href={`mailto:${profile.person.email}`}>{profile.person.email}</TerminalLink>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-orange-500">GitHub:</span>
      <TerminalLink href={profile.social.github}>{profile.social.github.replace("https://", "")}</TerminalLink>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-orange-500">LinkedIn:</span>
      <TerminalLink href={profile.social.linkedin}>{profile.social.linkedin.replace("https://", "")}</TerminalLink>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-orange-500">Location:</span>
      <span className="text-green-400">{profile.person.location}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-orange-500">Languages:</span>
      <span className="text-green-400">
        {about.languages.map((lang) => `${lang.language} (${lang.level})`).join(", ")}
      </span>
    </div>
  </div>
);

export const renderCertificates = ({ certificates }: SiteContent) => {
  const allCertificates = certificates.slice(0, CERTIFICATE_CATEGORY_LIMIT).flatMap((category) =>
    category.certificates.map((cert) => (
      <TerminalListItem key={`${category.category}-${cert.name}-${cert.year}`} className="text-green-400">
        {cert.name} ({cert.year})
      </TerminalListItem>
    ))
  );

  return <ul className="space-y-1">{allCertificates}</ul>;
};

export const renderAchievements = ({ experience }: SiteContent) => {
  const achievements = experience
    .slice(0, ACHIEVEMENT_ROLE_LIMIT)
    .flatMap((exp) =>
      exp.achievements
        .slice(0, ACHIEVEMENTS_PER_ROLE)
        .map((achievement) => <TerminalListItem key={`${exp.title}-${achievement}`}>{achievement}</TerminalListItem>)
    );

  return <ul className="space-y-1">{achievements}</ul>;
};

export const HelpCommandOutput = () => (
  <div className="mt-2">
    <p className="text-orange-500 font-bold mb-2">Available commands:</p>
    {Object.entries(AVAILABLE_COMMANDS).map(([cmd, desc]) => (
      <div key={cmd} className="grid grid-cols-[120px_1fr] gap-2 mt-1 group">
        <button
          type="button"
          className="text-green-400 font-bold group-hover:text-green-300 transition-colors cursor-pointer hover:underline bg-transparent border-none p-0 text-left"
          onClick={() => {
            window.dispatchEvent(new CustomEvent(TERMINAL_COMMAND_CLICK_EVENT, { detail: { command: cmd } }));
          }}
          title={`Click to run: ${cmd}`}
        >
          {cmd}
        </button>
        <span className="text-gray-400 group-hover:text-gray-300 transition-colors">{desc}</span>
      </div>
    ))}
  </div>
);

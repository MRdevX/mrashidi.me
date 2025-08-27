import type { ReactElement } from "react";
import { certificates, personalInfo, projects, skills, workExperience } from "@/data";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { AVAILABLE_COMMANDS } from "./constants";
import type { CommandType } from "./types";

interface BlogPost {
  title: string;
  content: string;
  url: string;
  publishedAt: string;
  imageUrl?: string;
  author: {
    username: string;
    name: string;
    mediumUrl: string;
  };
}

const TerminalSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mt-2 space-y-2">
    <p className="text-orange-500 font-bold">{title}</p>
    {children}
  </div>
);

const TerminalLink = ({
  href,
  children,
  className = "text-green-400 hover:underline",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
    {children}
  </a>
);

const TerminalListItem = ({
  children,
  className = "text-gray-400",
}: {
  children: React.ReactNode;
  className?: string;
}) => <li className={className}>• {children}</li>;

const TerminalBadge = ({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "public" | "private" | "personal" | "professional" | "default";
}) => {
  const { colors } = useThemeConfig();

  const variants = {
    public: `bg-[${colors.success.DEFAULT}] text-white`,
    private: "bg-gray-700 text-gray-300",
    personal: `bg-[${colors.info.DEFAULT}] text-white`,
    professional: `bg-[${colors.primary.DEFAULT}] text-white`,
    default: "bg-gray-700 text-gray-300",
  };

  return <span className={`px-2 py-0.5 rounded font-semibold text-xs ${variants[variant]}`}>{children}</span>;
};

const formatSkillsByLevel = () => {
  return skills.map((cat) => {
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
          ([level, skills]) =>
            skills.length > 0 && (
              <div key={level} className="ml-2">
                <span className="text-green-400 capitalize">{level}: </span>
                <span className="text-gray-200">{skills.map((s) => s.name).join(", ")}</span>
              </div>
            )
        )}
        <div className="text-gray-600">----------------------------------------</div>
      </div>
    );
  });
};

const renderWorkExperience = (limit?: number) => {
  const experiences = limit ? workExperience.slice(0, limit) : workExperience;

  return experiences.map((exp, idx) => (
    <div key={`${exp.title}-${idx}`} className="mb-4">
      <p className="text-orange-500 font-bold">{exp.title}</p>
      <p className="text-green-400">{exp.company}</p>
      <p className="text-gray-400">• {exp.period}</p>
      {exp.achievements.slice(0, 3).map((achievement, achievementIdx) => (
        <p key={achievementIdx} className="text-gray-400">
          • {achievement}
        </p>
      ))}
    </div>
  ));
};

const renderProjects = (limit?: number) => {
  const projectList = limit ? projects.slice(0, limit) : projects;

  return projectList.map((project, idx) => (
    <div key={`${project.title}-${idx}`} className="mb-4">
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

const renderContactInfo = () => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <span className="text-orange-500">Email:</span>
      <TerminalLink href={`mailto:${personalInfo.email}`}>{personalInfo.email}</TerminalLink>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-orange-500">GitHub:</span>
      <TerminalLink href={personalInfo.social.github}>
        {personalInfo.social.github.replace("https://", "")}
      </TerminalLink>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-orange-500">LinkedIn:</span>
      <TerminalLink href={personalInfo.social.linkedin}>
        {personalInfo.social.linkedin.replace("https://", "")}
      </TerminalLink>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-orange-500">Location:</span>
      <span className="text-green-400">{personalInfo.location}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-orange-500">Languages:</span>
      <span className="text-green-400">
        {personalInfo.languages.map((lang) => `${lang.language} (${lang.level})`).join(", ")}
      </span>
    </div>
  </div>
);

const renderCertificates = () => {
  const allCertificates = certificates.slice(0, 8).flatMap((category) =>
    category.certificates.map((cert, idx) => (
      <TerminalListItem key={`${cert.name}-${idx}`} className="text-green-400">
        {cert.name} ({cert.year})
      </TerminalListItem>
    ))
  );

  return <ul className="space-y-1">{allCertificates}</ul>;
};

const renderAchievements = () => {
  const achievements = workExperience
    .slice(0, 2)
    .flatMap((exp) =>
      exp.achievements
        .slice(0, 3)
        .map((achievement, idx) => <TerminalListItem key={`${exp.title}-${idx}`}>{achievement}</TerminalListItem>)
    );

  return <ul className="space-y-1">{achievements}</ul>;
};

const commandHandlers = {
  help: () => (
    <div className="mt-2">
      <p className="text-orange-500 font-bold mb-2">Available commands:</p>
      {Object.entries(AVAILABLE_COMMANDS).map(([cmd, desc]) => (
        <div key={cmd} className="grid grid-cols-[120px_1fr] gap-2 mt-1 group">
          <span className="text-green-400 font-bold group-hover:text-green-300 transition-colors">{cmd}</span>
          <span className="text-gray-400 group-hover:text-gray-300 transition-colors">{desc}</span>
        </div>
      ))}
    </div>
  ),

  about: () => (
    <div className="mt-2 space-y-2">
      <p>{personalInfo.bio}</p>
    </div>
  ),

  experience: () => <div className="mt-2 space-y-4">{renderWorkExperience()}</div>,

  skills: () => <div className="font-mono text-sm text-gray-200 mt-2">{formatSkillsByLevel()}</div>,

  projects: () => <div className="mt-2 space-y-4">{renderProjects(3)}</div>,

  achievements: () => (
    <div className="mt-2 space-y-4">
      <TerminalSection title="Recent Certifications:">{renderCertificates()}</TerminalSection>
      <TerminalSection title="Key Achievements:">{renderAchievements()}</TerminalSection>
    </div>
  ),

  contact: () => <div className="mt-2 space-y-2">{renderContactInfo()}</div>,

  blog: async () => {
    try {
      const response = await fetch("/api/blog?page=1&limit=5");
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch blog posts");
      }

      const posts = data.data || [];

      return (
        <div className="mt-2">
          <p className="mb-4">Visit my blog for articles on backend development and cloud architecture:</p>
          <TerminalLink href="/blog">mrashidi.me/blog</TerminalLink>
          <div className="mt-4 space-y-2">
            <p className="text-orange-500 font-bold">Recent Articles:</p>
            {posts.length > 0 ? (
              <ul className="space-y-1">
                {posts.map((post: BlogPost) => (
                  <li key={post.url} className="text-gray-400">
                    • <TerminalLink href={post.url}>{post.title}</TerminalLink>
                    <span className="text-gray-500 text-xs ml-2">
                      ({new Date(post.publishedAt).toLocaleDateString()})
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No recent articles found. Please visit the blog page directly.</p>
            )}
          </div>
        </div>
      );
    } catch (error) {
      return (
        <div className="mt-2">
          <p className="mb-4">Visit my blog for articles on backend development and cloud architecture:</p>
          <TerminalLink href="/blog">mrashidi.me/blog</TerminalLink>
          <div className="mt-4 space-y-2">
            <p className="text-orange-500 font-bold">Recent Articles:</p>
            <p className="text-red-500">
              Failed to load recent articles: {error instanceof Error ? error.message : "Unknown error"}
            </p>
            <p className="text-gray-500 text-sm">Please visit the blog page directly or try again later.</p>
          </div>
        </div>
      );
    }
  },

  "view-source": () => (
    <div className="mt-2 space-y-2">
      <p>This website is open source! 🎉</p>
      <p className="text-orange-500 font-bold">Repository:</p>
      <TerminalLink href="https://github.com/MRdevX/mrashidi.me">github.com/MRdevX/mrashidi.me</TerminalLink>
      <p className="text-gray-500 text-sm mt-2">Built with Next.js, TypeScript, and Tailwind CSS</p>
      <p className="text-gray-500 text-sm">Features: Interactive terminal, GitHub integration, blog posts</p>
      <p className="text-gray-500 text-xs mt-2">Feel free to explore, contribute, or use as inspiration!</p>
      <p className="text-gray-500 text-xs">— Mahdi Rashidi</p>
    </div>
  ),

  clear: () => {
    return "";
  },
};

export const handleCommand = async (command: CommandType): Promise<string | ReactElement> => {
  const handler = commandHandlers[command];

  if (!handler) {
    return 'Command not found. Type "help" for available commands.';
  }

  try {
    return await handler();
  } catch (_error) {
    return `Error executing command "${command}". Please try again.`;
  }
};

import type { ReactElement, ReactNode } from "react";
import { type BlogPost, fetchBlogPage } from "@/features/blog";
import type { SiteContent } from "@/lib/content";
import {
  HelpCommandOutput,
  renderAchievements,
  renderCertificates,
  renderContactInfo,
  renderProjects,
  renderWorkExperience,
  SkillsByLevel,
} from "./commandOutputs";
import { TERMINAL_CONSTANTS } from "./constants";
import { TerminalLink, TerminalSection } from "./TerminalPrimitives";
import type { CommandType } from "./types";

const PROJECTS_PREVIEW_COUNT = 3;
const RECENT_POSTS_COUNT = 5;

const BlogOutput = ({ children }: { children: ReactNode }) => (
  <div className="mt-2">
    <p className="mb-4">Visit my blog for articles on backend development and cloud architecture:</p>
    <TerminalLink href="/blog">mrashidi.me/blog</TerminalLink>
    <div className="mt-4 space-y-2">
      <p className="text-orange-500 font-bold">Recent Articles:</p>
      {children}
    </div>
  </div>
);

const renderRecentPosts = (posts: BlogPost[]) =>
  posts.length > 0 ? (
    <ul className="space-y-1">
      {posts.map((post) => (
        <li key={post.url} className="text-gray-400">
          • <TerminalLink href={post.url}>{post.title}</TerminalLink>
          <span className="text-gray-500 text-xs ml-2">({new Date(post.publishedAt).toLocaleDateString()})</span>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500">No recent articles found. Please visit the blog page directly.</p>
  );

const commandHandlers: Record<CommandType, (content: SiteContent) => ReactElement | string | Promise<ReactElement>> = {
  help: () => <HelpCommandOutput />,

  ask: () => (
    <div className="mt-2 space-y-1">
      <p>
        Usage: <span className="text-green-400">ask &lt;question&gt;</span>
      </p>
      <p className="text-gray-500">e.g. ask has he worked with Kubernetes?</p>
    </div>
  ),

  about: ({ about }) => (
    <div className="mt-2 space-y-2">
      <p>{about.bio.map((segment) => segment.text).join("")}</p>
    </div>
  ),

  experience: (content) => <div className="mt-2 space-y-4">{renderWorkExperience(content)}</div>,

  skills: ({ skills }) => (
    <div className="font-mono text-sm text-gray-200 mt-2">
      <SkillsByLevel skills={skills} />
    </div>
  ),

  projects: (content) => <div className="mt-2 space-y-4">{renderProjects(content, PROJECTS_PREVIEW_COUNT)}</div>,

  achievements: (content) => (
    <div className="mt-2 space-y-4">
      <TerminalSection title="Recent Certifications:">{renderCertificates(content)}</TerminalSection>
      <TerminalSection title="Key Achievements:">{renderAchievements(content)}</TerminalSection>
    </div>
  ),

  contact: (content) => <div className="mt-2 space-y-2">{renderContactInfo(content)}</div>,

  blog: async () => {
    try {
      const { posts } = await fetchBlogPage(1, RECENT_POSTS_COUNT);
      return <BlogOutput>{renderRecentPosts(posts)}</BlogOutput>;
    } catch (error) {
      return (
        <BlogOutput>
          <p className="text-red-500">
            Failed to load recent articles: {error instanceof Error ? error.message : "Unknown error"}
          </p>
          <p className="text-gray-500 text-sm">Please visit the blog page directly or try again later.</p>
        </BlogOutput>
      );
    }
  },

  "view-source": ({ profile }) => (
    <div className="mt-2 space-y-2">
      <p>This website is open source! 🎉</p>
      <p className="text-orange-500 font-bold">Repository:</p>
      <TerminalLink href={profile.social.githubRepo}>{profile.social.githubRepo.replace("https://", "")}</TerminalLink>
      <p className="text-gray-500 text-sm mt-2">Built with Next.js, TypeScript, and Tailwind CSS</p>
      <p className="text-gray-500 text-sm">Features: Interactive terminal, GitHub integration, blog posts</p>
      <p className="text-gray-500 text-xs mt-2">Feel free to explore, contribute, or use as inspiration!</p>
      <p className="text-gray-500 text-xs">— {profile.person.name}</p>
    </div>
  ),

  clear: () => {
    return "";
  },
};

export const handleCommand = async (command: CommandType, content: SiteContent): Promise<string | ReactElement> => {
  const handler = commandHandlers[command];

  if (!handler) {
    return TERMINAL_CONSTANTS.NOT_FOUND_MESSAGE;
  }

  try {
    return await handler(content);
  } catch (_error) {
    return `Error executing command "${command}". Please try again.`;
  }
};

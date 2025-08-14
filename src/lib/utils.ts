import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extracts repository owner and name from a GitHub URL
 * @param githubUrl GitHub repository URL
 * @returns Object with owner and name, or null if invalid
 */
export const extractGitHubRepoInfo = (githubUrl: string): { owner: string; name: string } | null => {
  const repoMatch = githubUrl.match(/github\.com\/([^\/]+\/[^\/]+)/);
  if (!repoMatch) {
    return null;
  }

  const [owner, name] = repoMatch[1].split("/");
  return { owner, name };
};

/**
 * Formats a date for display
 * @param date Date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Creates a GitHub commit URL from repository URL and commit hash
 * @param repoUrl GitHub repository URL
 * @param commitHash Full commit hash
 * @returns GitHub commit URL
 */
export const createCommitUrl = (repoUrl: string, commitHash: string): string => {
  return `${repoUrl}/commit/${commitHash}`;
};

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function cleanHtmlContent(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\n\s*\n/g, "\n")
    .trim();
}

export function extractImageUrl(html: string): string | undefined {
  if (!html) return undefined;
  const imgMatch = html.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch ? imgMatch[1] : undefined;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function debounce<T extends readonly unknown[], R>(func: (...args: T) => R, wait: number): (...args: T) => void {
  let timeout: NodeJS.Timeout;
  return (...args: T) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

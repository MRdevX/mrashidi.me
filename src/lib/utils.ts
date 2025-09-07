import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractGitHubRepoInfo = (githubUrl: string): { owner: string; name: string } | null => {
  const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  return match ? { owner: match[1], name: match[2] } : null;
};

export const createCommitUrl = (repoUrl: string, commitHash: string): string => {
  return `${repoUrl}/commit/${commitHash}`;
};

export function cleanHtmlContent(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

export function extractImageUrl(html: string): string | undefined {
  const imgMatch = html.match(/<img[^>]+src="([^"]+)"/);
  return imgMatch ? imgMatch[1] : undefined;
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

export function truncateText(text: string, maxLength: number): string {
  return text.length <= maxLength ? text : `${text.slice(0, maxLength - 3)}...`;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minute${Math.floor(diffInSeconds / 60) > 1 ? "s" : ""} ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hour${Math.floor(diffInSeconds / 3600) > 1 ? "s" : ""} ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} day${Math.floor(diffInSeconds / 86400) > 1 ? "s" : ""} ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 604800)} week${Math.floor(diffInSeconds / 604800) > 1 ? "s" : ""} ago`;
  if (diffInSeconds < 31536000)
    return `${Math.floor(diffInSeconds / 2592000)} month${Math.floor(diffInSeconds / 2592000) > 1 ? "s" : ""} ago`;
  return `${Math.floor(diffInSeconds / 31536000)} year${Math.floor(diffInSeconds / 31536000) > 1 ? "s" : ""} ago`;
}

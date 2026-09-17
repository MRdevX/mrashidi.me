import { logger } from "@/lib/core";
import { githubService } from "@/lib/services/github";

export interface CommitInfo {
  date: Date;
  hash: string;
}

export type CommitInfoMap = ReadonlyMap<string, CommitInfo>;

type StoredCommits = Record<string, { date: string; hash: string }>;

const STORAGE_KEY = "project_commit_dates_v2";
const TTL_MS = 24 * 60 * 60 * 1000;

const readCache = (): StoredCommits => {
  try {
    const entry = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as {
      data: StoredCommits;
      timestamp: number;
    } | null;
    return entry && Date.now() - entry.timestamp < TTL_MS ? entry.data : {};
  } catch (error) {
    logger.warn({ operation: "readCommitCache", error: String(error) });
    return {};
  }
};

const writeCache = (commits: CommitInfoMap) => {
  const data: StoredCommits = {};
  for (const [url, { date, hash }] of commits) {
    data[url] = { date: date.toISOString(), hash };
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch (error) {
    logger.warn({ operation: "writeCommitCache", error: String(error) });
  }
};

export const loadCommitInfo = async (repoUrls: readonly string[]): Promise<CommitInfoMap> => {
  const cached = readCache();
  const commits = new Map<string, CommitInfo>();

  for (const url of repoUrls) {
    const hit = cached[url];
    const date = hit && new Date(hit.date);
    if (hit?.hash && date && !Number.isNaN(date.getTime())) {
      commits.set(url, { date, hash: hit.hash });
    }
  }

  const missing = repoUrls.filter((url) => !commits.has(url));
  if (missing.length === 0) {
    return commits;
  }

  const fetched = await Promise.all(missing.map((url) => githubService.getLatestCommitInfo(url)));
  fetched.forEach((info, index) => {
    if (info) {
      commits.set(missing[index], info);
    }
  });

  if (commits.size > 0) {
    writeCache(commits);
  }
  return commits;
};

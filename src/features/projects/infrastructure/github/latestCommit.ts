import { API_CONFIG, getEnv } from "@/lib/core";
import { APIError } from "@/lib/errors";
import type { CommitInfo } from "../../domain/commit";

interface GitHubRepo {
  default_branch: string;
}

interface GitHubCommit {
  sha: string;
  commit: {
    author: { date: string } | null;
    committer: { date: string } | null;
  };
}

export const GITHUB_USER_AGENT = "mrashidi.me-portfolio";

const FALLBACK_BRANCHES = ["main", "master"];

const extractRepoInfo = (githubUrl: string): { owner: string; name: string } | null => {
  try {
    const url = new URL(githubUrl);
    if (url.hostname !== "github.com") {
      return null;
    }

    const [owner, name] = url.pathname.replace(/\/+$/, "").split("/").filter(Boolean);
    return owner && name ? { owner, name } : null;
  } catch {
    return null;
  }
};

const requestGitHub = async <T>(endpoint: string, token?: string): Promise<T> => {
  const response = await fetch(`${API_CONFIG.GITHUB.BASE_URL}${endpoint}`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": GITHUB_USER_AGENT,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new APIError(`GitHub API error: ${response.status}`, response.status);
  }

  return response.json();
};

const isAuthFailure = (error: unknown) =>
  error instanceof APIError && (error.statusCode === 401 || error.statusCode === 403);

const fetchGitHub = async <T>(endpoint: string): Promise<T> => {
  const token = getEnv("GH_REST_API_TOKEN");
  if (!token) {
    return requestGitHub<T>(endpoint);
  }

  try {
    return await requestGitHub<T>(endpoint, token);
  } catch (error) {
    if (isAuthFailure(error)) {
      return requestGitHub<T>(endpoint);
    }
    throw error;
  }
};

const commitDateFromPayload = (commit: GitHubCommit["commit"]): Date | null => {
  const raw = commit.committer?.date ?? commit.author?.date;
  if (!raw) {
    return null;
  }
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
};

const fetchBranchHead = async (owner: string, name: string, branch: string): Promise<CommitInfo | null> => {
  const commits = await fetchGitHub<GitHubCommit[]>(
    `/repos/${owner}/${name}/commits?per_page=1&sha=${encodeURIComponent(branch)}`
  );
  const date = commits.length > 0 ? commitDateFromPayload(commits[0].commit) : null;
  return date ? { date, hash: commits[0].sha } : null;
};

export const findLatestCommit = async (githubUrl: string): Promise<CommitInfo | null> => {
  const repoInfo = extractRepoInfo(githubUrl);
  if (!repoInfo) {
    return null;
  }

  const { owner, name } = repoInfo;

  try {
    const repo = await fetchGitHub<GitHubRepo>(`/repos/${owner}/${name}`);
    const head = await fetchBranchHead(owner, name, repo.default_branch || "main");
    if (head) {
      return head;
    }
  } catch {
    // Fall back to the fixed branch guesses below.
  }

  for (const branch of FALLBACK_BRANCHES) {
    try {
      const head = await fetchBranchHead(owner, name, branch);
      if (head) {
        return head;
      }
    } catch {
      // A missing branch returns 404; try the next one.
    }
  }

  return null;
};

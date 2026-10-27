export interface RepoRef {
  url: string;
  owner: string;
  name: string;
}

function githubPath(url: string): string[] | null {
  try {
    const parsed = new URL(url);
    return parsed.hostname === "github.com" ? parsed.pathname.split("/").filter(Boolean) : null;
  } catch {
    return null;
  }
}

export function parseRepoRef(url: string): RepoRef | null {
  const [owner, name] = githubPath(url) ?? [];
  return owner && name ? { url, owner, name } : null;
}

export function parseGitHubLogin(profileUrl: string): string | null {
  return githubPath(profileUrl)?.[0] ?? null;
}

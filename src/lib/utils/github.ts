export const extractGitHubRepoInfo = (githubUrl: string): { owner: string; name: string } | null => {
  const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  return match ? { owner: match[1], name: match[2] } : null;
};

export const createCommitUrl = (repoUrl: string, commitHash: string): string => {
  return `${repoUrl}/commit/${commitHash}`;
};

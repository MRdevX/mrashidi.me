export const createCommitUrl = (repoUrl: string, commitHash: string): string => {
  let normalizedUrl = repoUrl;
  while (normalizedUrl.endsWith("/")) {
    normalizedUrl = normalizedUrl.slice(0, -1);
  }
  return `${normalizedUrl}/commit/${commitHash}`;
};

export const createCommitUrl = (repoUrl: string, commitHash: string): string => {
  const normalizedUrl = repoUrl.replace(/\/+$/, "");
  return `${normalizedUrl}/commit/${commitHash}`;
};

export const createCommitUrl = (repoUrl: string, commitHash: string): string => {
  return `${repoUrl}/commit/${commitHash}`;
};

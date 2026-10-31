export interface RepoCommit {
  hash: string;
  committedAt: string;
}

export type RepoActivity = Record<string, RepoCommit>;

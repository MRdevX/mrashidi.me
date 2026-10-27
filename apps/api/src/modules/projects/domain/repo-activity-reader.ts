export interface RepoCommit {
  hash: string;
  committedAt: string;
}

export interface RepoActivityReader {
  latestCommits(): Promise<Readonly<Record<string, RepoCommit>>>;
}

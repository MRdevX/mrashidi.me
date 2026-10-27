import type { Contributions } from "@mrashidi/types";
import type { ContributionWindow } from "./contribution-window.ts";
import type { RepoActivity } from "./repo-activity.ts";
import type { RepoRef } from "./repo-ref.ts";

export interface GitHubGateway {
  latestCommits(repos: readonly RepoRef[]): Promise<RepoActivity>;
  contributions(login: string, window: ContributionWindow): Promise<Contributions>;
}

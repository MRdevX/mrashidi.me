import { logger } from "@/lib/core";
import { fetchJSON } from "@/lib/fetcher";
import type { CommitInfo } from "../../domain/commit";

export async function getLatestCommitInfo(githubUrl: string): Promise<CommitInfo | null> {
  try {
    const commitInfo = await fetchJSON<CommitInfo>(
      `/api/github?action=commit-info&url=${encodeURIComponent(githubUrl)}`
    );

    if (!commitInfo) {
      return null;
    }

    return {
      date: new Date(commitInfo.date),
      hash: commitInfo.hash,
    };
  } catch (error) {
    logger.error({
      operation: "getLatestCommitInfo",
      githubUrl,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

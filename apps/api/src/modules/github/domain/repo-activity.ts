import { z } from "zod";

export const RepoCommitSchema = z.object({
  hash: z.string().min(1),
  committedAt: z.iso.datetime(),
});

export const RepoActivitySchema = z.record(z.string(), RepoCommitSchema);

export type RepoCommit = z.infer<typeof RepoCommitSchema>;
export type RepoActivity = z.infer<typeof RepoActivitySchema>;

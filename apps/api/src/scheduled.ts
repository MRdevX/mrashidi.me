import type { Bindings } from "#bindings";
import { createBlogRefresh } from "#modules/blog/index.ts";
import { createGitHubRefresh } from "#modules/github/index.ts";
import { createProfileContext } from "#modules/profile/index.ts";
import { createProjectContext } from "#modules/projects/index.ts";

async function refreshGitHub(env: Bindings, now: Date) {
  const [profile, projects] = await Promise.all([
    createProfileContext(env.DB).profile(),
    createProjectContext(env.DB).list(),
  ]);
  await createGitHubRefresh(
    env.DB,
    env.GH_API_TOKEN
  )({
    profileUrl: profile.social.github,
    repoUrls: projects.flatMap((project) => (project.githubUrl ? [project.githubUrl] : [])),
    now,
  });
}

async function refreshBlog(env: Bindings, now: Date) {
  const profile = await createProfileContext(env.DB).profile();
  await createBlogRefresh(env.DB)({ profileUrl: profile.social.medium, now });
}

export async function refreshExternalSources(env: Bindings, now: Date): Promise<void> {
  const results = await Promise.allSettled([refreshGitHub(env, now), refreshBlog(env, now)]);
  const failures = results.flatMap((result) => (result.status === "rejected" ? [result.reason] : []));
  if (failures.length > 0) {
    throw new AggregateError(failures, "External source refresh failed");
  }
}

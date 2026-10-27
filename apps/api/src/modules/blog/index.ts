import { createDb } from "#db/index.ts";
import { createProfileContext } from "#modules/profile/index.ts";
import { createBlogQueries } from "./application/blog-queries.ts";
import { createRefreshBlog } from "./application/refresh-blog.ts";
import { createD1BlogSnapshotRepository } from "./infrastructure/d1-blog-snapshot-repository.ts";
import { createMediumFeedGateway } from "./infrastructure/medium-feed-gateway.ts";

export type { BlogQueries } from "./application/blog-queries.ts";
export { blogRoutes } from "./http/blog-routes.ts";

export function createBlogContext(db: D1Database) {
  const refresh = createBlogRefresh(db);
  return createBlogQueries(createD1BlogSnapshotRepository(createDb(db)), async (now) => {
    const profile = await createProfileContext(db).profile();
    await refresh({ profileUrl: profile.social.medium, now });
  });
}

export function createBlogRefresh(db: D1Database) {
  return createRefreshBlog(createMediumFeedGateway(), createD1BlogSnapshotRepository(createDb(db)));
}

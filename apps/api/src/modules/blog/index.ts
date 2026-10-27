import type { Bindings } from "#bindings";
import { createDb } from "#db/index.ts";
import { createProfileContext } from "#modules/profile/index.ts";
import type { Background } from "#shared/snapshot-read-through.ts";
import { createBlogQueries } from "./application/blog-queries.ts";
import { createRefreshBlog } from "./application/refresh-blog.ts";
import { createD1BlogSnapshotRepository } from "./infrastructure/d1-blog-snapshot-repository.ts";
import { createMediumFeedGateway } from "./infrastructure/medium-feed-gateway.ts";

export type { BlogQueries } from "./application/blog-queries.ts";
export { blogRoutes } from "./http/blog-routes.ts";

export function createBlogContext(env: Bindings, background: Background) {
  const repository = createD1BlogSnapshotRepository(createDb(env.DB));
  const refreshBlog = createRefreshBlog(createMediumFeedGateway(), repository);
  return createBlogQueries(
    repository,
    async (now) => refreshBlog({ profileUrl: (await createProfileContext(env.DB).profile()).social.medium, now }),
    background
  );
}

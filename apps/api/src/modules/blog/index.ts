import type { Background } from "#shared/snapshot-read-through.ts";
import { createBlogQueries } from "./application/blog-queries.ts";
import type { BlogSnapshotRepository, FeedGateway } from "./application/ports.ts";
import { createRefreshBlog } from "./application/refresh-blog.ts";

export { blogRoutes } from "./http/blog-routes.ts";
export { createD1BlogSnapshotRepository } from "./infrastructure/d1-blog-snapshot-repository.ts";
export { createMediumFeedGateway } from "./infrastructure/medium-feed-gateway.ts";

export interface BlogDependencies {
  repository: BlogSnapshotRepository;
  gateway: FeedGateway;
  profileUrl: () => Promise<string>;
  background: Background;
}

export function createBlogContext({ repository, gateway, profileUrl, background }: BlogDependencies) {
  const refreshBlog = createRefreshBlog(gateway, repository);
  return createBlogQueries(repository, async (now) => refreshBlog({ profileUrl: await profileUrl(), now }), background);
}

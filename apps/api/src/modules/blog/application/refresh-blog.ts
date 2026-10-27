import { mediumFeedUrl, toBlogPosts } from "../domain/blog-post.ts";
import type { BlogSnapshotRepository } from "../domain/blog-snapshot-repository.ts";
import type { FeedGateway } from "../domain/feed-gateway.ts";

export interface RefreshBlogInput {
  profileUrl: string;
  now: Date;
}

export function createRefreshBlog(gateway: FeedGateway, repository: BlogSnapshotRepository) {
  return async ({ profileUrl, now }: RefreshBlogInput): Promise<void> => {
    const feedUrl = mediumFeedUrl(profileUrl);
    if (!feedUrl) {
      throw new Error(`Not a Medium profile URL: ${profileUrl}`);
    }
    await repository.savePosts(toBlogPosts(await gateway.items(feedUrl)), now);
  };
}

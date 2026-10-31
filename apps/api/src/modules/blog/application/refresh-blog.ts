import type { BlogPost } from "@mrashidi/types";
import { InvalidMediumProfileUrlError, mediumFeedUrl, toBlogPosts } from "../domain/blog-post.ts";
import type { BlogSnapshotRepository, FeedGateway } from "./ports.ts";

export interface RefreshBlogInput {
  profileUrl: string;
  now: Date;
}

export function createRefreshBlog(gateway: FeedGateway, repository: BlogSnapshotRepository) {
  return async ({ profileUrl, now }: RefreshBlogInput): Promise<BlogPost[]> => {
    const feedUrl = mediumFeedUrl(profileUrl);
    if (!feedUrl) {
      throw new InvalidMediumProfileUrlError(profileUrl);
    }
    const posts = toBlogPosts(await gateway.items(feedUrl));
    await repository.savePosts(posts, now);
    return posts;
  };
}

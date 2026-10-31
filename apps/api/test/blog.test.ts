import { env } from "cloudflare:workers";
import { fixtureContent } from "@mrashidi/types/fixtures";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createDb } from "#db/index.ts";
import { snapshots } from "#db/schema.ts";
import { createBlogQueries } from "#modules/blog/application/blog-queries.ts";
import { createRefreshBlog } from "#modules/blog/application/refresh-blog.ts";
import {
  EXCERPT_LENGTH,
  type FeedItem,
  mediumFeedUrl,
  pageOf,
  toBlogPosts,
  toExcerpt,
} from "#modules/blog/domain/blog-post.ts";
import type { FeedGateway } from "#modules/blog/domain/feed-gateway.ts";
import { createD1BlogSnapshotRepository } from "#modules/blog/infrastructure/d1-blog-snapshot-repository.ts";
import { createMediumFeedGateway, readHtml } from "#modules/blog/infrastructure/medium-feed-gateway.ts";
import { authedApi } from "./api.ts";

const FIXTURES = "../../../packages/types/fixtures/api";
const NOW = new Date("2026-03-04T05:00:00Z");

const item = (n: number, over: Partial<FeedItem> = {}): FeedItem => ({
  title: `Post ${n}`,
  url: `https://medium.com/@janedoe/post-${n}`,
  publishedAt: new Date(Date.UTC(2026, 0, n)).toISOString(),
  text: `Notes from building service number ${n}. It covers queues, retries and the boring parts that keep APIs up.`,
  ...over,
});

const FEED_ITEMS = [1, 2, 3, 4, 5, 6, 7].map((n) =>
  item(n, n % 2 ? { imageUrl: `https://cdn.example.com/post-${n}.png` } : {})
);

const repository = () => createD1BlogSnapshotRepository(createDb(env.DB));
const refresh = (gateway: FeedGateway, now = new Date()) =>
  createRefreshBlog(gateway, repository())({ profileUrl: fixtureContent.profile.social.medium, now });

describe("blog domain", () => {
  it("finds the RSS feed for both Medium profile URL styles", () => {
    expect(mediumFeedUrl("https://medium.com/@janedoe")).toBe("https://medium.com/feed/@janedoe");
    expect(mediumFeedUrl("https://janedoe.medium.com")).toBe("https://janedoe.medium.com/feed");
    expect(mediumFeedUrl("https://example.com/@janedoe")).toBeNull();
  });

  it("cuts excerpts at a word boundary", () => {
    const excerpt = toExcerpt("word ".repeat(200));
    expect(excerpt.length).toBeLessThanOrEqual(EXCERPT_LENGTH + 1);
    expect(excerpt.endsWith("word…")).toBe(true);
    expect(toExcerpt("  short\n text ")).toBe("short text");
  });

  it("orders posts newest first and pages them", () => {
    const posts = toBlogPosts(FEED_ITEMS);
    expect(posts[0]?.title).toBe("Post 7");
    expect(pageOf(posts, 2, 3)).toMatchObject({
      total: 7,
      posts: [{ title: "Post 4" }, { title: "Post 3" }, { title: "Post 2" }],
    });
  });
});

describe("Medium feed gateway", () => {
  it("reads text without tags and the first absolute image from post HTML", async () => {
    const html =
      '<figure><img src="/relative.png"><img src="https://cdn.example.com/a.png"></figure><p>Hello <strong>world</strong> &amp; <a href="https://x.dev">friends</a></p><p>Next&#8217;s</p>';
    expect(await readHtml(html)).toEqual({
      text: "Hello world & friends Next’s",
      imageUrl: "https://cdn.example.com/a.png",
    });
    expect(await readHtml("")).toEqual({ text: "", imageUrl: undefined });
  });

  it("parses RSS items, a single item included", async () => {
    const rss = `<?xml version="1.0"?><rss xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel>
      <item><title>Queues &amp; you</title><link>https://medium.com/@janedoe/queues</link>
      <pubDate>Mon, 02 Mar 2026 10:00:00 GMT</pubDate>
      <content:encoded><![CDATA[<p>Body text</p><img src="https://cdn.example.com/q.png">]]></content:encoded></item>
    </channel></rss>`;
    const fetcher = vi.fn<typeof fetch>(async () => new Response(rss));

    const items = await createMediumFeedGateway(fetcher).items("https://medium.com/feed/@janedoe");

    expect(fetcher).toHaveBeenCalledWith("https://medium.com/feed/@janedoe", expect.anything());
    expect(items).toEqual([
      {
        title: "Queues & you",
        url: "https://medium.com/@janedoe/queues",
        publishedAt: "2026-03-02T10:00:00.000Z",
        imageUrl: "https://cdn.example.com/q.png",
        text: "Body text",
      },
    ]);
  });

  it("fails on an error status or a body that is not RSS", async () => {
    await expect(
      createMediumFeedGateway(async () => new Response("", { status: 403 })).items("https://x")
    ).rejects.toThrow("403");
    await expect(createMediumFeedGateway(async () => new Response("<html></html>")).items("https://x")).rejects.toThrow(
      "RSS"
    );
  });
});

describe("blog refresh and routes", () => {
  beforeEach(async () => {
    await createDb(env.DB).delete(snapshots);
  });

  it("serves refreshed posts, matching the read-model fixture", async () => {
    await refresh({ items: async () => FEED_ITEMS });

    const res = await authedApi("/v1/blog/posts?page=1&limit=50");
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toContain("s-maxage");
    await expect(`${JSON.stringify(await res.json(), null, 2)}\n`).toMatchFileSnapshot(`${FIXTURES}/blog-posts.json`);
  });

  it("pages posts and rejects bad paging", async () => {
    await refresh({ items: async () => FEED_ITEMS });

    expect(await (await authedApi("/v1/blog/posts?page=3&limit=3")).json()).toMatchObject({
      total: 7,
      posts: [{ title: "Post 1" }],
    });
    expect((await authedApi("/v1/blog/posts?page=0")).status).toBe(400);
    expect((await authedApi("/v1/blog/posts?limit=500")).status).toBe(400);
  });

  it("keeps the previous posts when the feed fails", async () => {
    await refresh({ items: async () => FEED_ITEMS });

    await expect(
      refresh({
        items: async () => {
          throw new Error("Medium down");
        },
      })
    ).rejects.toThrow("Medium down");
    expect((await repository().getPosts())?.data).toHaveLength(FEED_ITEMS.length);
  });
});

describe("blog queries", () => {
  const queries = (gateway: FeedGateway, background: (work: Promise<unknown>) => void = () => {}) =>
    createBlogQueries(
      repository(),
      (now) => refresh(gateway, now),
      background,
      () => NOW
    );

  beforeEach(async () => {
    await createDb(env.DB).delete(snapshots);
  });

  it("fetches and saves the feed on the first request", async () => {
    expect(await queries({ items: async () => FEED_ITEMS }).page(1, 50)).toMatchObject({ total: 7 });
    expect((await repository().getPosts())?.fetchedAt).toEqual(NOW);
  });

  it("serves stale posts and saves the new feed in the background", async () => {
    await refresh({ items: async () => FEED_ITEMS }, new Date(0));
    const queued: Promise<unknown>[] = [];

    const page = await queries({ items: async () => [...FEED_ITEMS, item(8)] }, (work) => queued.push(work)).page(
      1,
      50
    );
    await Promise.all(queued);

    expect(page.total).toBe(7);
    expect((await repository().getPosts())?.data).toHaveLength(8);
  });
});

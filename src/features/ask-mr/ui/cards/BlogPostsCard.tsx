"use client";

import Link from "next/link";
import { NewTabSrOnly } from "@/lib/a11y/new-tab-hint";
import { trackAskMr } from "../../client/analytics";
import type { AskMrBlogPost } from "../../server/tools";
import { CardShell } from "./CardShell";

const dateFormat = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" });

export function BlogPostsCard({ posts, onNavigate }: { posts: AskMrBlogPost[]; onNavigate: () => void }) {
  if (posts.length === 0) {
    return (
      <CardShell title="Blog">
        <Link href="/blog" onClick={onNavigate} className="text-sm text-orange-600 underline dark:text-orange-400">
          Browse all posts on the blog page
        </Link>
      </CardShell>
    );
  }

  return (
    <CardShell title="Latest posts">
      <ul className="divide-y divide-gray-200 dark:divide-white/10">
        {posts.map((post) => (
          <li key={post.url}>
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackAskMr("ask_mr_tool_click", { tool: "getLatestPosts" })}
              className="block rounded py-2 text-sm hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60 dark:hover:text-orange-400"
            >
              <span className="font-medium text-gray-900 dark:text-gray-100">{post.title}</span>
              <time dateTime={post.publishedAt} className="mt-0.5 block font-terminal text-[11px] text-gray-500">
                {dateFormat.format(new Date(post.publishedAt))}
              </time>
              <NewTabSrOnly />
            </a>
          </li>
        ))}
      </ul>
    </CardShell>
  );
}

import { z } from "zod";

export const BlogPostSchema = z.object({
  title: z.string().min(1),
  url: z.url(),
  publishedAt: z.iso.datetime(),
  imageUrl: z.url().optional(),
  excerpt: z.string(),
});

export const BlogPostPageSchema = z.object({
  posts: z.array(BlogPostSchema),
  total: z.number().int().nonnegative(),
});

export type BlogPost = z.infer<typeof BlogPostSchema>;
export type BlogPostPage = z.infer<typeof BlogPostPageSchema>;

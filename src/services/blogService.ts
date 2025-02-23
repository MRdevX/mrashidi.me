import { BlogResponse } from "@/types/blog";

interface MediumPostResponse {
  title: string;
  content: string;
  url: string;
  publishedAt: string;
  imageUrl?: string;
  author: {
    username: string;
    name: string;
    mediumUrl: string;
  };
}

class BlogService {
  async getBlogPosts(page: number = 1, limit: number = 10): Promise<BlogResponse> {
    try {
      const response = await fetch(`/api/blog?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error("Failed to fetch blog posts");
      }
      const data: { posts: MediumPostResponse[]; total: number } = await response.json();
      return {
        posts: data.posts.map((post) => ({
          ...post,
          publishedAt: new Date(post.publishedAt),
        })),
        total: data.total,
      };
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
      throw error;
    }
  }
}

export const blogService = new BlogService();

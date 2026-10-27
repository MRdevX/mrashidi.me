import type { BlogPost } from "@mrashidi/types";

export type { BlogPost };

export interface BlogResponse {
  success: boolean;
  data: BlogPost[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface BlogData {
  posts: BlogPost[];
  total: number;
}

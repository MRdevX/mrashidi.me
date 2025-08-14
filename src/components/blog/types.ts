export interface BlogPost {
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

export interface BlogResponse {
  success: boolean;
  data: BlogPost[];
  meta?: {
    fromCache?: boolean;
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface BlogData {
  posts: BlogPost[];
  total: number;
}

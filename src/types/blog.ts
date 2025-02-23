export interface IBlogAuthor {
  username: string;
  name: string;
  mediumUrl: string;
}

export interface IBlogPost {
  title: string;
  content: string;
  url: string;
  publishedAt: Date;
  imageUrl?: string;
  author: IBlogAuthor;
}

export interface IMediumRssFeed {
  rss: {
    channel: {
      item: {
        title: string;
        link: string;
        pubDate: string;
        "content:encoded": string;
      }[];
    };
  };
}

export interface BlogResponse {
  posts: IBlogPost[];
  total: number;
}

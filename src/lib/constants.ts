export const API_CONFIG = {
  GITHUB: {
    BASE_URL: "https://api.github.com",
    GRAPHQL_URL: "https://api.github.com/graphql",
    USERNAME: "mrdevx",
  },
  RECAPTCHA: {
    THRESHOLD: 0.5,
  },
  CACHE: {
    BLOG_UPDATE_INTERVAL: 1000 * 60 * 60,
    REVALIDATE_TIME: 3600,
  },
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50,
} as const;

export const BLOG_AUTHORS = [
  {
    username: "mrdevx",
    name: "Mahdi Rashidi",
    mediumUrl: "https://mrdevx.medium.com",
  },
] as const;

export const ANIMATION = {
  FAST: 0.2,
  NORMAL: 0.3,
  SLOW: 0.5,
} as const;

export const TECHNOLOGY_CATEGORIES = {
  frameworks: ["NestJS", "Next.js", "React", "Framer Motion", "TypeORM", "Drizzle ORM", "Hono"],
  languages: ["TypeScript", "JavaScript", "Python", "Java", "Rust", "Bash"],
  databases: ["PostgreSQL", "MongoDB", "Redis", "Supabase", "PostgREST"],
  clouds: ["AWS", "Azure", "Docker", "Kubernetes"],
};

export type TechnologyCategory = keyof typeof TECHNOLOGY_CATEGORIES;

export const CATEGORY_DISPLAY_NAMES: Record<TechnologyCategory, string> = {
  frameworks: "Frameworks",
  languages: "Programming Languages",
  databases: "Databases",
  clouds: "Cloud & Infrastructure",
} as const;

export const getAllTechnologies = (): string[] => {
  return Object.values(TECHNOLOGY_CATEGORIES).flat() as string[];
};

export const getTechnologyCategory = (technology: string): TechnologyCategory | null => {
  for (const [category, technologies] of Object.entries(TECHNOLOGY_CATEGORIES)) {
    if (technologies.includes(technology)) {
      return category as TechnologyCategory;
    }
  }
  return null;
};

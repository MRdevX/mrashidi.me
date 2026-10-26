export interface SiteConfig {
  person: {
    name: string;
    title: string;
    location: string;
    email: string;
    website: string;
    twitterHandle: string;
  };

  social: {
    github: string;
    linkedin: string;
    telegram: string;
    githubRepo: string;
  };

  site: {
    url: string;
    name: string;
    title: string;
    description: string;
    keywords: string;
  };

  ui: {
    themeColor: string;
    msTileColor: string;
    appName: string;
    appTitle: string;
    appleMobileWebAppTitle: string;
    mobileWebAppCapable: boolean;
    appleMobileWebAppCapable: boolean;
    appleMobileWebAppStatusBarStyle: string;
  };
}

const config: SiteConfig = {
  person: {
    name: "Mahdi Rashidi",
    title: "Software Engineer",
    location: "Berlin, Germany",
    email: "contact@mrashidi.me",
    website: "https://mrashidi.me",
    twitterHandle: "@your_twitter_handle",
  },
  social: {
    github: "https://github.com/mrdevx",
    linkedin: "https://www.linkedin.com/in/mrdevx",
    telegram: "https://t.me/systemdee",
    githubRepo: "https://github.com/MRdevX/mrashidi.me",
  },
  site: {
    url: "https://mrashidi.me",
    name: "MR Portfolio",
    title: "Mahdi Rashidi | Software Engineer",
    description:
      "Backend engineer with 11 years of experience building and running production services, mostly in Node.js, NestJS, TypeScript and PostgreSQL on GCP, Azure and Cloudflare. I focus on reliable, maintainable systems that scale with business needs.",
    keywords:
      "Software Engineer, Web Developer, Node.js, TypeScript, Portfolio, Software Engineer, Backend Development, API Development, System Design, Cloud Architecture, Berlin, Germany, Freelance Developer, Full Stack Developer, Database Design, Microservices, DevOps, GCP, Azure, Cloudflare, Docker, Kubernetes, PostgreSQL, Redis, NestJS, REST API",
  },
  ui: {
    themeColor: "#12151c",
    msTileColor: "#f97316",
    appName: "MR Portfolio",
    appTitle: "MR Portfolio",
    appleMobileWebAppTitle: "MR Portfolio",
    mobileWebAppCapable: true,
    appleMobileWebAppCapable: true,
    appleMobileWebAppStatusBarStyle: "black-translucent",
  },
};

export { config };

export const siteConfig = config.ui;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mrashidi.me";

// Single source of truth for all site configuration
export interface SiteConfig {
  // Person information
  person: {
    name: string;
    title: string;
    location: string;
    email: string;
    website: string;
    twitterHandle: string;
  };

  // Social links
  social: {
    github: string;
    linkedin: string;
    telegram: string;
    githubRepo: string;
  };

  // Site metadata
  site: {
    url: string;
    name: string;
    title: string;
    description: string;
    keywords: string;
  };

  // UI configuration
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

export const config: SiteConfig = {
  person: {
    name: "Dee Rashidi",
    title: "Software Engineer",
    location: "Berlin, Germany",
    email: "contact@mrashidi.me",
    website: "https://mrashidi.me",
    twitterHandle: "@your_twitter_handle",
  },
  social: {
    github: "https://github.com/mrdevx",
    linkedin: "https://linkedin.com/in/deerashidi",
    telegram: "https://t.me/deerashidi",
    githubRepo: "https://github.com/MRdevX/mrashidi.me",
  },
  site: {
    url: "https://mrashidi.me",
    name: "MR Portfolio",
    title: "Dee Rashidi | Software Backend Engineer",
    description:
      "Software engineer with 9 years of experience in backend development. I work primarily with Node.js and TypeScript, with additional experience across frameworks and languages. I focus on building reliable, maintainable systems that scale with business needs.",
    keywords:
      "Software Backend Engineer, Web Developer, Node.js, TypeScript, Portfolio, Software Engineer, Backend Development, API Development, System Design, Cloud Architecture, Berlin, Germany, Freelance Developer, Full Stack Developer, Database Design, Microservices, DevOps, AWS, Azure, Docker, Kubernetes, PostgreSQL, MongoDB, Redis, GraphQL, REST API",
  },
  ui: {
    themeColor: "#f97316",
    msTileColor: "#f97316",
    appName: "MR Portfolio",
    appTitle: "MR Portfolio",
    appleMobileWebAppTitle: "MR Portfolio",
    mobileWebAppCapable: true,
    appleMobileWebAppCapable: true,
    appleMobileWebAppStatusBarStyle: "black-translucent",
  },
};

// Derived configurations for backward compatibility
export const coreConfig = {
  person: config.person,
  social: config.social,
  site: config.site,
};

export const siteConfig = config.ui;
export const siteMetadata = {
  title: config.site.title,
  keywords: config.site.keywords,
  creator: config.person.name,
  authors: [{ name: config.person.name, url: config.site.url }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: config.site.url,
    siteName: `${config.person.name} - ${config.person.title}`,
    title: config.site.title,
    images: [
      {
        url: `${config.site.url}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${config.person.name} - ${config.person.title}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: config.site.title,
    creator: config.person.twitterHandle,
    images: [`${config.site.url}/twitter-image.jpg`],
  },
  robots: "index, follow",
  alternates: {
    canonical: config.site.url,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export interface CoreConfig {
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
}

const coreConfig: CoreConfig = {
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
};

export default coreConfig;

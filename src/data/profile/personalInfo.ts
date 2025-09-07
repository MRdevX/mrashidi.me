import coreConfig from "../core";

export interface SocialLinks {
  github: string;
  linkedin: string;
  email: string;
  website: string;
  telegram: string;
}

export interface Language {
  language: string;
  level: string;
  progress: number;
}

export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  website: string;
  social: SocialLinks;
  languages: Language[];
  bio: string;
  intro: string;
  contactCta: string;
  contactDescription: string;
}

const personalInfo: PersonalInfo = {
  name: coreConfig.person.name,
  title: coreConfig.person.title,
  location: coreConfig.person.location,
  email: coreConfig.person.email,
  website: coreConfig.person.website,
  social: {
    github: coreConfig.social.github,
    linkedin: coreConfig.social.linkedin,
    email: coreConfig.person.email,
    website: coreConfig.person.website,
    telegram: coreConfig.social.telegram,
  },
  languages: [
    { language: "Persian", level: "Native Proficiency", progress: 100 },
    { language: "English", level: "Fluent (C1)", progress: 90 },
    { language: "German", level: "Pre-Intermediate (A2)", progress: 40 },
    { language: "Turkish", level: "Elementary (A1)", progress: 20 },
  ],
  bio: "I’m a software engineer with 9 years of experience building scalable backend systems and microservices. For the past 6 years, I’ve specialized in Node.js and TypeScript, with earlier experience in Java and Python for scripting and automation. My background spans backend development, cloud infrastructure, and DevOps, working with tools like Docker, Kubernetes, and CI/CD pipelines on AWS and Azure. I’ve contributed to projects in e-mobility, fintech, aviation, and education, always focusing on clean, maintainable code and systems that grow with business needs.",
  intro: coreConfig.site.description,
  contactCta: "Feel Free to Reach Out",
  contactDescription:
    "I'm open to discussing new opportunities. If you think I might be a good fit for what you're building, feel free to reach out and we can chat about it.",
};

export default personalInfo;

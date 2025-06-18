export interface SocialLinks {
  github: string;
  linkedin: string;
  email: string;
  website: string;
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
  summary: string;
  description: string;
  intro: string;
  contactCta: string;
  contactDescription: string;
}

const personalInfo: PersonalInfo = {
  name: "Mahdi Rashidi",
  title: "Senior Backend Engineer & Cloud/DevOps Practitioner",
  location: "Berlin, Germany",
  email: "contact@mrashidi.me",
  website: "https://mrashidi.me",
  social: {
    github: "https://github.com/mrdevx",
    linkedin: "https://linkedin.com/in/deerashidi",
    email: "contact@mrashidi.me",
    website: "https://mrashidi.me",
  },
  languages: [
    { language: "Persian", level: "Native Proficiency", progress: 100 },
    { language: "English", level: "Fluent (C1)", progress: 90 },
    { language: "German", level: "Pre-Intermediate (A2)", progress: 40 },
    { language: "Turkish", level: "Elementary (A1)", progress: 20 },
  ],
  summary:
    "Backend Engineer with 9+ years experience, including 6+ years building scalable TypeScript/Node.js applications and cloud‑native solutions. Experienced in microservices architecture, Kubernetes, and multi‑cloud platforms including Azure, AWS, and GCP. Focused on delivering reliable enterprise solutions with emphasis on high availability and performance optimization.",
  description:
    "Expert Software Backend Engineer specializing in React, Node.js, and modern web technologies. I specialize in building scalable TypeScript/Node.js applications and cloud-native solutions. My expertise includes microservices architecture, Kubernetes, and multi-cloud platforms (Azure, AWS, GCP). Based in Berlin, Germany, I focus on delivering reliable enterprise solutions with emphasis on high availability and performance optimization.",
  intro:
    "With 9+ years building scalable applications, I solve real-world problems using TypeScript, Node.js, and Kubernetes, with early Java experience. I design lean and reliable systems such as microservices and event-driven architectures across cloud platforms. I continuously explore new tools to keep solutions simple and efficient.",
  contactCta: "Ready to Discuss Your Next Project?",
  contactDescription:
    "Looking for a backend engineer who can bring your ideas to life? Let's connect and discuss how we can work together to create scalable, efficient solutions for your business.",
};

export default personalInfo;

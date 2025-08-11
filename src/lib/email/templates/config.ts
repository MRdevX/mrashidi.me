import { ITemplateConfig } from "../types";

export const getTemplateConfig = (): ITemplateConfig => ({
  companyName: "Mahdi Rashidi",
  companyWebsite: "https://mrashidi.me",
  socialLinks: {
    github: "https://github.com/mrdevx",
    linkedin: "https://linkedin.com/in/deerashidi",
  },
  footerText: "Software Backend Engineer specializing in Backend Development, Cloud & DevOps, and Database Design",
  skills: [
    { name: "Backend Development", technologies: ["Node.js", "TypeScript", "Python", "Go"] },
    { name: "Cloud & DevOps", technologies: ["AWS", "Docker", "Kubernetes", "Terraform"] },
    { name: "Database Design", technologies: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch"] },
  ],
});

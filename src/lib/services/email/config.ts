import { config } from "@/data";
import type { ITemplateConfig } from "./types";

export const getTemplateConfig = (): ITemplateConfig => ({
  companyName: config.person.name,
  companyWebsite: config.site.url,
  socialLinks: {
    github: config.social.github,
    linkedin: config.social.linkedin,
  },
  footerText: "Software Backend Engineer specializing in Backend Development, Cloud & DevOps, and Database Design",
  skills: [
    {
      name: "Backend Development",
      technologies: ["Node.js", "TypeScript", "Python", "Go"],
    },
    {
      name: "Cloud & DevOps",
      technologies: ["AWS", "Docker", "Kubernetes", "Terraform"],
    },
    {
      name: "Database Design",
      technologies: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch"],
    },
  ],
});

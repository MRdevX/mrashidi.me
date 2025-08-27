import { coreConfig } from "@/data";
import type { ITemplateConfig } from "../types";

export const getTemplateConfig = (): ITemplateConfig => ({
  companyName: coreConfig.person.name,
  companyWebsite: coreConfig.site.url,
  socialLinks: {
    github: coreConfig.social.github,
    linkedin: coreConfig.social.linkedin,
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

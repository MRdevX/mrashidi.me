import { config } from "@/data";
import type { ITemplateConfig } from "./types";

export const getTemplateConfig = (): ITemplateConfig => ({
  companyName: config.person.name,
  companyWebsite: config.site.url,
  socialLinks: {
    github: config.social.github,
    linkedin: config.social.linkedin,
    telegram: config.social.telegram,
  },
  footerText: config.person.title,
});

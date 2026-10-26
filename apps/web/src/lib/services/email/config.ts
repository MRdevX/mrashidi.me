import type { Profile } from "@mrashidi/types";
import { SITE_URL } from "@/data";
import type { ITemplateConfig } from "./types";

export const getTemplateConfig = ({ person, social }: Profile): ITemplateConfig => ({
  companyName: person.name,
  companyWebsite: SITE_URL,
  socialLinks: {
    github: social.github,
    linkedin: social.linkedin,
    telegram: social.telegram,
  },
  footerText: person.title,
});

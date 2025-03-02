export interface IContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ISkill {
  name: string;
  technologies: string[];
}

export interface ITemplateConfig {
  companyName: string;
  companyWebsite: string;
  socialLinks: {
    github: string;
    linkedin: string;
  };
  footerText: string;
  skills: ISkill[];
}

export interface IEmailTemplateOptions {
  subject: string;
  content: string;
  showSocialLinks?: boolean;
} 
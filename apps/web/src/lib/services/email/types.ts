export interface ITemplateConfig {
  companyName: string;
  companyWebsite: string;
  socialLinks: {
    github: string;
    linkedin: string;
    telegram: string;
  };
  footerText: string;
}

export interface EmailTemplateData {
  name: string;
  email: string;
  subject?: string;
  message?: string;
  company?: string;
}

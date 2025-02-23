export interface IContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ITemplateConfig {
  companyName: string;
  companyWebsite: string;
}

export interface IEmailTemplateOptions {
  subject: string;
  content: string;
  showSocialLinks?: boolean;
} 
import type { ContactMessage, CvRequest, Profile } from "@mrashidi/types";

export type MailTemplate = "contact-admin" | "contact-user" | "resume-admin" | "resume-user";

export interface MailTemplateData {
  name: string;
  email: string;
  subject?: string;
  message?: string;
  company?: string;
  cvUrl?: string;
}

export interface OutboundEmail {
  to: string;
  subject: string;
  replyTo?: string;
  template: MailTemplate;
  data: MailTemplateData;
}

export interface MailBrand {
  name: string;
  website: string;
  tagline: string;
  social: { github: string; linkedin: string; telegram: string };
}

export function mailBrand({ person, social }: Profile): MailBrand {
  return {
    name: person.name,
    website: person.website,
    tagline: person.title,
    social: { github: social.github, linkedin: social.linkedin, telegram: social.telegram },
  };
}

export function contactEmails(message: ContactMessage, owner: string, brand: MailBrand): OutboundEmail[] {
  return [
    {
      to: owner,
      subject: `Contact Form Submission from ${message.name}`,
      replyTo: message.email,
      template: "contact-admin",
      data: message,
    },
    {
      to: message.email,
      subject: `Thanks for reaching out, ${message.name}! | ${brand.name}`,
      template: "contact-user",
      data: { name: message.name, email: message.email },
    },
  ];
}

export function cvRequestEmails(request: CvRequest, owner: string, brand: MailBrand): OutboundEmail[] {
  return [
    {
      to: owner,
      subject: `CV Request from ${request.name}`,
      replyTo: request.email,
      template: "resume-admin",
      data: request,
    },
    {
      to: request.email,
      subject: `Your copy of my CV - ${brand.name}`,
      template: "resume-user",
      data: request,
    },
  ];
}

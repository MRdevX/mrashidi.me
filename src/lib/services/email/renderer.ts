import { render, toPlainText } from "@react-email/render";
import { createElement } from "react";
import type { getTemplateConfig } from "./config";
import { ContactAdminTemplate, ContactUserTemplate, ResumeAdminTemplate, ResumeUserTemplate } from "./templates";
import type { EmailTemplateData } from "./types";

const TEMPLATES = {
  "contact-admin": ContactAdminTemplate,
  "contact-user": ContactUserTemplate,
  "resume-admin": ResumeAdminTemplate,
  "resume-user": ResumeUserTemplate,
} as const;

export type EmailTemplateType = keyof typeof TEMPLATES;

export async function createEmailTemplate(
  data: EmailTemplateData,
  templateType: string,
  templateConfig: ReturnType<typeof getTemplateConfig>
): Promise<{ html: string; text: string }> {
  const TemplateComponent = TEMPLATES[templateType as EmailTemplateType];
  if (!TemplateComponent) {
    throw new Error(`Unknown template type: ${templateType}`);
  }

  const emailElement = createElement(TemplateComponent, { data, templateConfig });

  const html = await render(emailElement);
  const text = toPlainText(html);

  return { html, text };
}

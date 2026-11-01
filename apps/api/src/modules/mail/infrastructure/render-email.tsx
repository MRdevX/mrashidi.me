import { render, toPlainText } from "@react-email/render";
import type { MailBrand, MailTemplate, MailTemplateData } from "../domain/outbound-email.ts";
import { ContactAdminTemplate } from "./templates/ContactAdminTemplate.tsx";
import { ContactUserTemplate } from "./templates/ContactUserTemplate.tsx";
import { ResumeAdminTemplate } from "./templates/ResumeAdminTemplate.tsx";
import { ResumeUserTemplate } from "./templates/ResumeUserTemplate.tsx";

const TEMPLATES = {
  "contact-admin": ContactAdminTemplate,
  "contact-user": ContactUserTemplate,
  "resume-admin": ResumeAdminTemplate,
  "resume-user": ResumeUserTemplate,
} satisfies Record<MailTemplate, unknown>;

export async function renderEmail(template: MailTemplate, data: MailTemplateData, brand: MailBrand) {
  const Template = TEMPLATES[template];
  const html = await render(<Template data={data} brand={brand} />);
  return { html, text: toPlainText(html) };
}

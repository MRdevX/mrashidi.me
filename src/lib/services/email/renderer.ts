import { render } from "@react-email/render";
import { createElement } from "react";
import type { getTemplateConfig } from "./config";
import { ContactAdminTemplate, ContactUserTemplate, ResumeAdminTemplate, ResumeUserTemplate } from "./templates";
import type { EmailTemplateData } from "./types";

type TemplateComponentType =
  | typeof ContactAdminTemplate
  | typeof ContactUserTemplate
  | typeof ResumeAdminTemplate
  | typeof ResumeUserTemplate;

export async function createEmailTemplate(
  data: EmailTemplateData,
  templateType: string,
  templateConfig: ReturnType<typeof getTemplateConfig>
): Promise<{ html: string; text: string }> {
  let TemplateComponent: TemplateComponentType;

  switch (templateType) {
    case "contact-admin":
      TemplateComponent = ContactAdminTemplate;
      break;
    case "contact-user":
      TemplateComponent = ContactUserTemplate;
      break;
    case "resume-admin":
      TemplateComponent = ResumeAdminTemplate;
      break;
    case "resume-user":
      TemplateComponent = ResumeUserTemplate;
      break;
    default:
      throw new Error(`Unknown template type: ${templateType}`);
  }

  const emailElement = createElement(TemplateComponent, { data, templateConfig });

  const html = await render(emailElement);
  const text = await render(emailElement, { plainText: true });

  return { html, text };
}

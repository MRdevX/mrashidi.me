import { BaseEmailTemplate, CallToActionButton, EmailGreeting, EmailParagraph, EmailSignature } from "../components";
import type { EmailTemplateData, ITemplateConfig } from "../types";

interface ResumeUserTemplateProps {
  data: EmailTemplateData;
  templateConfig: ITemplateConfig;
}

export function ResumeUserTemplate({ data, templateConfig }: ResumeUserTemplateProps) {
  return (
    <BaseEmailTemplate
      preview="Thanks for downloading — explore the portfolio and reach out anytime."
      templateConfig={templateConfig}
      title="Resume Request Confirmation"
    >
      <EmailGreeting>Hi {data.name},</EmailGreeting>

      <EmailParagraph>
        Thanks for downloading my CV! I hope it gives you a good overview of my background and experience.
      </EmailParagraph>

      <EmailParagraph>
        If you want to learn more, my portfolio has detailed information about projects, tech stack highlights, and
        things I&apos;ve built.
      </EmailParagraph>

      <CallToActionButton href={templateConfig.companyWebsite}>Check Out My Portfolio</CallToActionButton>

      <EmailParagraph>
        Have questions or want to discuss opportunities? I&apos;d love to hear from you — use the contact form on my
        site anytime.
      </EmailParagraph>

      <EmailSignature>
        Looking forward to connecting!
        <br />
        <strong>Mahdi</strong>
      </EmailSignature>
    </BaseEmailTemplate>
  );
}

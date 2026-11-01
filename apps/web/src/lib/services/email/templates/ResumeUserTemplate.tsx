import { BaseEmailTemplate, CallToActionButton, EmailGreeting, EmailParagraph, EmailSignature } from "../components";
import type { EmailTemplateData, ITemplateConfig } from "../types";

interface ResumeUserTemplateProps {
  data: EmailTemplateData;
  templateConfig: ITemplateConfig;
}

export function ResumeUserTemplate({ data, templateConfig }: ResumeUserTemplateProps) {
  return (
    <BaseEmailTemplate
      preview="Here is your link to download my CV. It works for 24 hours."
      templateConfig={templateConfig}
      title="Your Copy of My CV"
    >
      <EmailGreeting>Hi {data.name},</EmailGreeting>

      <EmailParagraph>
        Thanks for your interest! Use the button below to download my CV. The link works for 24 hours; after that you
        can request a new one on my site.
      </EmailParagraph>

      {data.cvUrl ? <CallToActionButton href={data.cvUrl}>Download CV</CallToActionButton> : null}

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
        <strong>{templateConfig.companyName.split(" ")[0]}</strong>
      </EmailSignature>
    </BaseEmailTemplate>
  );
}

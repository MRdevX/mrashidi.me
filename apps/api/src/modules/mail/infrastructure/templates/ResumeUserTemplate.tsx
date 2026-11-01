import type { MailBrand, MailTemplateData } from "../../domain/outbound-email.ts";
import {
  BaseEmailTemplate,
  CallToActionButton,
  EmailGreeting,
  EmailParagraph,
  EmailSignature,
} from "./components/index.ts";

interface ResumeUserTemplateProps {
  data: MailTemplateData;
  brand: MailBrand;
}

export function ResumeUserTemplate({ data, brand }: ResumeUserTemplateProps) {
  return (
    <BaseEmailTemplate
      preview="Here is your link to download my CV. It works for 24 hours."
      brand={brand}
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

      <CallToActionButton href={brand.website}>Check Out My Portfolio</CallToActionButton>

      <EmailParagraph>
        Have questions or want to discuss opportunities? I&apos;d love to hear from you — use the contact form on my
        site anytime.
      </EmailParagraph>

      <EmailSignature>
        Looking forward to connecting!
        <br />
        <strong>{brand.name.split(" ")[0]}</strong>
      </EmailSignature>
    </BaseEmailTemplate>
  );
}

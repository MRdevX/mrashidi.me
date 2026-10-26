import { BaseEmailTemplate, CallToActionButton, EmailGreeting, EmailParagraph, EmailSignature } from "../components";
import type { EmailTemplateData, ITemplateConfig } from "../types";

interface ContactUserTemplateProps {
  data: EmailTemplateData;
  templateConfig: ITemplateConfig;
}

export function ContactUserTemplate({ data, templateConfig }: ContactUserTemplateProps) {
  return (
    <BaseEmailTemplate
      preview="Your message arrived — replies usually come within a day or two."
      templateConfig={templateConfig}
      title="Message Received"
    >
      <EmailGreeting>Hi {data.name},</EmailGreeting>

      <EmailParagraph>
        Thanks for getting in touch! I received your message{data.subject ? ` about "${data.subject}"` : ""} and wanted
        to let you know it came through perfectly.
      </EmailParagraph>

      <EmailParagraph>
        I read through all my messages personally and really enjoy connecting with people. I&apos;ll get back to you
        soon — usually within a day or two.
      </EmailParagraph>

      <EmailParagraph>
        While you&apos;re waiting, feel free to take a look at my portfolio for recent projects.
      </EmailParagraph>

      <CallToActionButton href={templateConfig.companyWebsite}>Check Out My Work</CallToActionButton>

      <EmailSignature>
        Looking forward to connecting!
        <br />
        <strong>Mahdi</strong>
      </EmailSignature>
    </BaseEmailTemplate>
  );
}

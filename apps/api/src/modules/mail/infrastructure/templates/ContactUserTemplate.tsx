import type { MailBrand, MailTemplateData } from "../../domain/outbound-email.ts";
import {
  BaseEmailTemplate,
  CallToActionButton,
  EmailGreeting,
  EmailParagraph,
  EmailSignature,
} from "./components/index.ts";

interface ContactUserTemplateProps {
  data: MailTemplateData;
  brand: MailBrand;
}

export function ContactUserTemplate({ data, brand }: ContactUserTemplateProps) {
  return (
    <BaseEmailTemplate
      preview="Your message arrived — replies usually come within a day or two."
      brand={brand}
      title="Message Received"
    >
      <EmailGreeting>Hi {data.name},</EmailGreeting>

      <EmailParagraph>
        Thanks for getting in touch! I received your message and wanted to let you know it came through perfectly.
      </EmailParagraph>

      <EmailParagraph>
        I read through all my messages personally and really enjoy connecting with people. I&apos;ll get back to you
        soon — usually within a day or two.
      </EmailParagraph>

      <EmailParagraph>
        While you&apos;re waiting, feel free to take a look at my portfolio for recent projects.
      </EmailParagraph>

      <CallToActionButton href={brand.website}>Check Out My Work</CallToActionButton>

      <EmailSignature>
        Looking forward to connecting!
        <br />
        <strong>{brand.name.split(" ")[0]}</strong>
      </EmailSignature>
    </BaseEmailTemplate>
  );
}

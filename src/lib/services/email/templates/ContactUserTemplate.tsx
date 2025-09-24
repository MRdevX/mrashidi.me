import { Text } from "@react-email/components";
import { BaseEmailTemplate, CallToActionButton } from "../components";
import type { EmailTemplateData, ITemplateConfig } from "../types";

interface ContactUserTemplateProps {
  data: EmailTemplateData;
  templateConfig: ITemplateConfig;
}

export function ContactUserTemplate({ data, templateConfig }: ContactUserTemplateProps) {
  return (
    <BaseEmailTemplate title="Message Received" templateConfig={templateConfig}>
      <Text style={greetingStyle}>Hi {data.name},</Text>

      <Text style={paragraphStyle}>
        Thank you for reaching out! I've received your message about "{data.subject}" and wanted to confirm that it's
        safely in my inbox.
      </Text>

      <Text style={paragraphStyle}>
        I personally review every message and will get back to you as soon as possible, typically within 1-2 business
        days.
      </Text>

      <CallToActionButton href={templateConfig.companyWebsite}>Visit My Portfolio</CallToActionButton>

      <Text style={signatureStyle}>
        Best regards,
        <br />
        Mahdi Rashidi
      </Text>
    </BaseEmailTemplate>
  );
}

const greetingStyle = {
  fontSize: "16px",
  marginBottom: "20px",
};

const paragraphStyle = {
  fontSize: "14px",
  lineHeight: "1.6",
  marginBottom: "20px",
};

const signatureStyle = {
  fontSize: "14px",
  marginTop: "20px",
};

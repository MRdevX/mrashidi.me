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
        Thank you for reaching out! I've received your message about <strong>"{data.subject}"</strong> and wanted to
        confirm that it's safely in my inbox.
      </Text>

      <Text style={paragraphStyle}>
        I personally review every message and will get back to you as soon as possible, typically within 1-2 business
        days.
      </Text>

      <CallToActionButton href={templateConfig.companyWebsite}>Visit My Portfolio</CallToActionButton>

      <Text style={signatureStyle}>
        Best regards,
        <br />
        <strong>Mahdi Rashidi</strong>
      </Text>
    </BaseEmailTemplate>
  );
}

const greetingStyle = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#1e293b",
  marginBottom: "24px",
};

const paragraphStyle = {
  fontSize: "16px",
  lineHeight: "1.7",
  color: "#475569",
  marginBottom: "20px",
};

const signatureStyle = {
  fontSize: "16px",
  color: "#475569",
  marginTop: "32px",
  lineHeight: "1.6",
};

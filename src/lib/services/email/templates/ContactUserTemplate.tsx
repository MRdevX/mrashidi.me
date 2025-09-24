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
      <Text style={greetingStyle}>Hey {data.name}! 👋</Text>

      <Text style={paragraphStyle}>
        Thanks for reaching out! I just got your message about <strong>"{data.subject}"</strong> and wanted to let you
        know it's safely in my inbox.
      </Text>

      <Text style={paragraphStyle}>
        I read every message personally and love connecting with new people. I'll get back to you as soon as I can -
        usually within a day or two!
      </Text>

      <Text style={paragraphStyle}>
        While you're waiting, feel free to check out my portfolio to see what I've been working on lately.
      </Text>

      <CallToActionButton href={templateConfig.companyWebsite}>Check Out My Work</CallToActionButton>

      <Text style={signatureStyle}>
        Talk soon!
        <br />
        <strong>Mahdi</strong> 🚀
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

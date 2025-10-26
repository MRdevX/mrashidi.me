import { Text } from "@react-email/components";
import { sanitizeUserInput } from "@/lib/utils/sanitize";
import { BaseEmailTemplate, CallToActionButton } from "../components";
import type { EmailTemplateData, ITemplateConfig } from "../types";

interface ContactUserTemplateProps {
  data: EmailTemplateData;
  templateConfig: ITemplateConfig;
}

export function ContactUserTemplate({ data, templateConfig }: ContactUserTemplateProps) {
  return (
    <BaseEmailTemplate title="Message Received" templateConfig={templateConfig}>
      <Text style={greetingStyle} className="dark-mode-text">
        Hi {sanitizeUserInput(data.name)},
      </Text>

      <Text style={paragraphStyle} className="dark-mode-text">
        Thanks for getting in touch! I received your message
        {data.subject ? ` about "${sanitizeUserInput(data.subject)}"` : ""} and wanted to let you know it came through
        perfectly.
      </Text>

      <Text style={paragraphStyle} className="dark-mode-text">
        I read through all my messages personally and really enjoy connecting with people. I'll get back to you soon -
        usually within a day or two.
      </Text>

      <Text style={paragraphStyle} className="dark-mode-text">
        While you're waiting, feel free to take a look at my portfolio to see some of the projects I've been working on.
      </Text>

      <CallToActionButton href={templateConfig.companyWebsite}>Check Out My Work</CallToActionButton>

      <Text style={signatureStyle} className="dark-mode-text">
        Looking forward to connecting!
        <br />
        <strong>Mahdi</strong>
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

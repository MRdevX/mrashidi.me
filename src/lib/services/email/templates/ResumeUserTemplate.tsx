import { Text } from "@react-email/components";
import { sanitizeUserInput } from "@/lib/utils/sanitize";
import { BaseEmailTemplate, CallToActionButton } from "../components";
import type { EmailTemplateData, ITemplateConfig } from "../types";

interface ResumeUserTemplateProps {
  data: EmailTemplateData;
  templateConfig: ITemplateConfig;
}

export function ResumeUserTemplate({ data, templateConfig }: ResumeUserTemplateProps) {
  return (
    <BaseEmailTemplate title="Resume Request Confirmation" templateConfig={templateConfig}>
      <Text style={greetingStyle} className="dark-mode-text">
        Hi {sanitizeUserInput(data.name)},
      </Text>

      <Text style={paragraphStyle} className="dark-mode-text">
        Thanks for downloading my CV! I hope it gives you a good overview of my background and experience.
      </Text>

      <Text style={paragraphStyle} className="dark-mode-text">
        If you want to learn more, my portfolio has detailed information about my projects, the technologies I work
        with, and some of the things I've built.
      </Text>

      <CallToActionButton href={templateConfig.companyWebsite}>Check Out My Portfolio</CallToActionButton>

      <Text style={paragraphStyle} className="dark-mode-text">
        Have questions or want to discuss potential opportunities? I'd love to hear from you! Feel free to reach out
        through the contact form on my site.
      </Text>

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

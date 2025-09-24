import { Text } from "@react-email/components";
import { BaseEmailTemplate, CallToActionButton } from "../components";
import type { EmailTemplateData, ITemplateConfig } from "../types";

interface ResumeUserTemplateProps {
  data: EmailTemplateData;
  templateConfig: ITemplateConfig;
}

export function ResumeUserTemplate({ data, templateConfig }: ResumeUserTemplateProps) {
  return (
    <BaseEmailTemplate title="Resume Request Confirmation" templateConfig={templateConfig}>
      <Text style={greetingStyle}>Hi {data.name},</Text>

      <Text style={paragraphStyle}>
        Thank you for your interest in my professional background! I hope you found my CV helpful.
      </Text>

      <Text style={paragraphStyle}>
        I invite you to explore my portfolio website where you can find detailed information about my experience,
        projects, and skills.
      </Text>

      <CallToActionButton href={templateConfig.companyWebsite}>Visit My Portfolio</CallToActionButton>

      <Text style={paragraphStyle}>
        If you'd like to get in touch or have any questions, feel free to reach out through the contact form on my
        website.
      </Text>

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

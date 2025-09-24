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

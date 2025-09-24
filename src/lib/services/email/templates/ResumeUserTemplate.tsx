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
      <Text style={greetingStyle}>Hey {data.name}! 🎉</Text>

      <Text style={paragraphStyle}>
        Awesome! Thanks for downloading my CV. I hope it gives you a good overview of what I've been up to
        professionally.
      </Text>

      <Text style={paragraphStyle}>
        If you want to dive deeper, my portfolio has all the juicy details about my projects, the tech I love working
        with, and some of the cool stuff I've built.
      </Text>

      <CallToActionButton href={templateConfig.companyWebsite}>Explore My Portfolio</CallToActionButton>

      <Text style={paragraphStyle}>
        Got questions or want to chat about potential opportunities? I'd love to hear from you! Just hit me up through
        the contact form on my site.
      </Text>

      <Text style={signatureStyle}>
        Looking forward to connecting!
        <br />
        <strong>Mahdi</strong> ✨
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

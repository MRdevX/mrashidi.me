import { Text } from "@react-email/components";
import { BaseEmailTemplate, InfoRow } from "../components";
import type { EmailTemplateData, ITemplateConfig } from "../types";

interface ResumeAdminTemplateProps {
  data: EmailTemplateData;
  templateConfig: ITemplateConfig;
}

export function ResumeAdminTemplate({ data, templateConfig }: ResumeAdminTemplateProps) {
  return (
    <BaseEmailTemplate title="Someone Downloaded Your CV" templateConfig={templateConfig}>
      <InfoRow label="Name" value={data.name} />
      <InfoRow label="Email" value={data.email} />
      {data.company && <InfoRow label="Company" value={data.company} />}

      <Text style={messageStyle} className="dark-mode-text">
        Great news! Someone just downloaded your resume from your portfolio. Time to follow up!
      </Text>
    </BaseEmailTemplate>
  );
}

const messageStyle = {
  fontSize: "16px",
  lineHeight: "1.7",
  color: "#475569",
  marginTop: "24px",
  padding: "16px 0",
  borderTop: "1px solid #f1f5f9",
};

import { Text } from "@react-email/components";
import { BaseEmailTemplate, InfoRow } from "../components";
import type { EmailTemplateData, ITemplateConfig } from "../types";

interface ResumeAdminTemplateProps {
  data: EmailTemplateData;
  templateConfig: ITemplateConfig;
}

export function ResumeAdminTemplate({ data, templateConfig }: ResumeAdminTemplateProps) {
  return (
    <BaseEmailTemplate title="New Resume Request" templateConfig={templateConfig}>
      <InfoRow label="Name" value={data.name} />
      <InfoRow label="Email" value={data.email} />
      {data.company && <InfoRow label="Company" value={data.company} />}

      <Text style={messageStyle}>Someone has downloaded your resume from your portfolio website.</Text>
    </BaseEmailTemplate>
  );
}

const messageStyle = {
  fontSize: "14px",
  lineHeight: "1.6",
  marginTop: "20px",
};

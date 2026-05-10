import { Text } from "@react-email/components";
import { BaseEmailTemplate, InfoRow } from "../components";
import { emailTheme } from "../theme";
import type { EmailTemplateData, ITemplateConfig } from "../types";

interface ResumeAdminTemplateProps {
  data: EmailTemplateData;
  templateConfig: ITemplateConfig;
}

export function ResumeAdminTemplate({ data, templateConfig }: ResumeAdminTemplateProps) {
  return (
    <BaseEmailTemplate
      preview="Someone just downloaded your CV from the portfolio."
      templateConfig={templateConfig}
      title="Someone Downloaded Your CV"
    >
      <InfoRow label="Name" value={data.name} />
      <InfoRow label="Email" value={data.email} />
      {data.company ? <InfoRow label="Company" value={data.company} /> : null}

      <Text style={messageStyle} className="dark-mode-text dark-mode-admin-divider">
        Great news! Someone just downloaded your resume from your portfolio. Time to follow up!
      </Text>
    </BaseEmailTemplate>
  );
}

const messageStyle = {
  fontSize: "16px",
  lineHeight: "1.7",
  color: emailTheme.lightTextParagraph,
  marginTop: "24px",
  padding: "16px 0",
  borderTop: `1px solid ${emailTheme.lightBorderMuted}`,
};

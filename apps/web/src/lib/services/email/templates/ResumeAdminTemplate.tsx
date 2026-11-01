import { Text } from "react-email";
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
      preview="Someone just requested your CV from the portfolio."
      templateConfig={templateConfig}
      title="Someone Requested Your CV"
    >
      <InfoRow label="Name" value={data.name} />
      <InfoRow label="Email" value={data.email} />
      {data.company ? <InfoRow label="Company" value={data.company} /> : null}

      <Text style={messageStyle} className="dark-mode-text dark-mode-admin-divider">
        Great news! Someone just requested your CV from your portfolio and was sent a download link. Time to follow up!
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

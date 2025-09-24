import { BaseEmailTemplate, InfoRow, MessageBox } from "../components";
import type { EmailTemplateData, ITemplateConfig } from "../types";

interface ContactAdminTemplateProps {
  data: EmailTemplateData;
  templateConfig: ITemplateConfig;
}

export function ContactAdminTemplate({ data, templateConfig }: ContactAdminTemplateProps) {
  return (
    <BaseEmailTemplate title="New Message from Your Website! 📧" templateConfig={templateConfig}>
      <InfoRow label="Name" value={data.name} />
      <InfoRow label="Email" value={data.email} />
      <InfoRow label="Subject" value={data.subject || "No subject"} />
      {data.message && <MessageBox label="Message" message={data.message} />}
    </BaseEmailTemplate>
  );
}

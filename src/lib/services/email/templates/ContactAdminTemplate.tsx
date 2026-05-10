import { BaseEmailTemplate, InfoRow, MessageBox } from "../components";
import type { EmailTemplateData, ITemplateConfig } from "../types";

interface ContactAdminTemplateProps {
  data: EmailTemplateData;
  templateConfig: ITemplateConfig;
}

export function ContactAdminTemplate({ data, templateConfig }: ContactAdminTemplateProps) {
  return (
    <BaseEmailTemplate
      preview="New website message — name, email, and full details below."
      templateConfig={templateConfig}
      title="New Message from Your Website"
    >
      <InfoRow label="Name" value={data.name} />
      <InfoRow label="Email" value={data.email} />
      <InfoRow label="Subject" value={data.subject || "No subject"} />
      {data.message ? <MessageBox label="Message" message={data.message} /> : null}
    </BaseEmailTemplate>
  );
}

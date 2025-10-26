import { sanitizeUserInput } from "@/lib/utils/sanitize";
import { BaseEmailTemplate, InfoRow, MessageBox } from "../components";
import type { EmailTemplateData, ITemplateConfig } from "../types";

interface ContactAdminTemplateProps {
  data: EmailTemplateData;
  templateConfig: ITemplateConfig;
}

export function ContactAdminTemplate({ data, templateConfig }: ContactAdminTemplateProps) {
  return (
    <BaseEmailTemplate title="New Message from Your Website" templateConfig={templateConfig}>
      <InfoRow label="Name" value={sanitizeUserInput(data.name)} />
      <InfoRow label="Email" value={sanitizeUserInput(data.email)} />
      <InfoRow label="Subject" value={sanitizeUserInput(data.subject || "No subject")} />
      {data.message && <MessageBox label="Message" message={sanitizeUserInput(data.message)} />}
    </BaseEmailTemplate>
  );
}

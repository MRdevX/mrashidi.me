import type { MailBrand, MailTemplateData } from "../../domain/outbound-email.ts";
import { BaseEmailTemplate, InfoRow, MessageBox } from "./components/index.ts";

interface ContactAdminTemplateProps {
  data: MailTemplateData;
  brand: MailBrand;
}

export function ContactAdminTemplate({ data, brand }: ContactAdminTemplateProps) {
  return (
    <BaseEmailTemplate
      preview="New website message — name, email, and full details below."
      brand={brand}
      title="New Message from Your Website"
    >
      <InfoRow label="Name" value={data.name} />
      <InfoRow label="Email" value={data.email} />
      <InfoRow label="Subject" value={data.subject || "No subject"} />
      {data.message ? <MessageBox label="Message" message={data.message} /> : null}
    </BaseEmailTemplate>
  );
}

import type { MailBrand, OutboundEmail } from "../domain/outbound-email.ts";

export interface MailBatch {
  emails: OutboundEmail[];
  brand: MailBrand;
  idempotencyKey: string;
}

export interface Mailer {
  send(batch: MailBatch): Promise<void>;
}

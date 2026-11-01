import { MailDeliveryError } from "../application/mail-delivery-error.ts";
import type { MailBatch, Mailer } from "../application/ports.ts";
import { renderEmail } from "./render-email.tsx";

const RESEND_BATCH_URL = "https://api.resend.com/emails/batch";

export interface ResendConfig {
  token: string;
  from: string;
}

async function errorReason(response: Response): Promise<string> {
  const body = (await response.json().catch(() => null)) as { name?: string; message?: string } | null;
  return [body?.name, body?.message].filter(Boolean).join(": ") || response.statusText;
}

export function createResendMailer({ token, from }: ResendConfig): Mailer {
  return {
    async send({ emails, brand, idempotencyKey }: MailBatch) {
      const payload = await Promise.all(
        emails.map(async ({ to, subject, replyTo, template, data }) => ({
          from: `${brand.name} <${from}>`,
          to: [to],
          subject,
          ...(replyTo ? { reply_to: replyTo } : {}),
          ...(await renderEmail(template, data, brand)),
        }))
      );
      const response = await fetch(RESEND_BATCH_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new MailDeliveryError(response.status, await errorReason(response));
      }
    },
  };
}

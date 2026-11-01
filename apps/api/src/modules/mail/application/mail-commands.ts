import type { ContactMessage, CvRequest } from "@mrashidi/types";
import type { ProfileQueries } from "#modules/profile/index.ts";
import { contactEmails, cvRequestEmails, mailBrand } from "../domain/outbound-email.ts";
import type { Mailer } from "./ports.ts";

export interface MailCommandDependencies {
  mailer: Mailer;
  profile: ProfileQueries;
  owner: string;
}

async function idempotencyKey(kind: string, payload: unknown): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(payload)));
  const hex = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${kind}/${hex}`;
}

export function createMailCommands({ mailer, profile, owner }: MailCommandDependencies) {
  return {
    async sendContactMessage(message: ContactMessage) {
      const brand = mailBrand(await profile.profile());
      await mailer.send({
        emails: contactEmails(message, owner, brand),
        brand,
        idempotencyKey: await idempotencyKey("contact", message),
      });
    },
    async sendCvLink(request: CvRequest) {
      const brand = mailBrand(await profile.profile());
      await mailer.send({
        emails: cvRequestEmails(request, owner, brand),
        brand,
        idempotencyKey: await idempotencyKey("cv-request", request),
      });
    },
  };
}

export type MailCommands = ReturnType<typeof createMailCommands>;

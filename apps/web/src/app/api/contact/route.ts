import type { ContactMessage } from "@mrashidi/types";
import type { NextRequest } from "next/server";
import { sendContactMessage } from "@/features/contact/server";
import { guardMailRequest } from "@/lib/api/mail-guard";
import { createMiddleware } from "@/lib/api/middleware";
import { createSuccessResponse } from "@/lib/api/response";
import { validateContactFormAPI } from "@/lib/validation";

async function handleContactForm(
  _request: NextRequest,
  { recaptchaToken, ...message }: ContactMessage & { recaptchaToken: string }
) {
  await guardMailRequest(recaptchaToken, "contact", message.email);
  await sendContactMessage(message);

  return createSuccessResponse({ message: "Message sent successfully" });
}

export const POST = createMiddleware("contactForm").validate(validateContactFormAPI).build(handleContactForm);

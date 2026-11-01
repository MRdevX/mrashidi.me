import type { ContactMessage } from "@mrashidi/types";
import type { NextRequest } from "next/server";
import { sendContactMessage } from "@/features/contact/server";
import { createMiddleware } from "@/lib/api/middleware";
import { createSuccessResponse } from "@/lib/api/response";
import { APIError } from "@/lib/errors";
import { verifyRecaptcha } from "@/lib/services/recaptcha";
import { validateContactFormAPI } from "@/lib/validation";

async function handleContactForm(
  _request: NextRequest,
  { recaptchaToken, ...message }: ContactMessage & { recaptchaToken: string }
) {
  try {
    await verifyRecaptcha(recaptchaToken);
  } catch (_error) {
    throw new APIError("reCAPTCHA verification failed", 400);
  }

  await sendContactMessage(message);

  return createSuccessResponse({ message: "Message sent successfully" });
}

export const POST = createMiddleware("contactForm").validate(validateContactFormAPI).build(handleContactForm);

import type { NextRequest } from "next/server";
import { createMiddleware } from "@/lib/api/middleware";
import { createSuccessResponse } from "@/lib/api/response";
import { APIError } from "@/lib/errors";
import { getEmailService } from "@/lib/services";
import { verifyRecaptcha } from "@/lib/services/recaptcha";
import { type ContactFormData, validateContactFormAPI } from "@/lib/validation";

async function handleContactForm(_request: NextRequest, formData: ContactFormData & { recaptchaToken: string }) {
  try {
    await verifyRecaptcha(formData.recaptchaToken);
  } catch (_error) {
    throw new APIError("reCAPTCHA verification failed", 400);
  }

  const emailService = getEmailService();
  const emailSent = await emailService.sendContactFormEmail({
    name: formData.name,
    email: formData.email,
    subject: formData.subject,
    message: formData.message,
  });

  if (!emailSent) {
    throw new APIError("Failed to send email", 500);
  }

  return createSuccessResponse({ message: "Message sent successfully" });
}

export const POST = createMiddleware("contactForm").validate(validateContactFormAPI).build(handleContactForm);

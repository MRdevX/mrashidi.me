import type { NextRequest } from "next/server";
import { withRateLimit, withValidation } from "@/lib/api/middleware";
import { createSuccessResponse } from "@/lib/api/response";
import { APIError } from "@/lib/errors";
import { EmailService } from "@/lib/services/email";
import { type ContactFormData, validateContactFormAPI } from "@/lib/validation";
import { verifyRecaptcha } from "@/server/recaptcha.service";

async function handleContactForm(_request: NextRequest, formData: ContactFormData & { recaptchaToken: string }) {
  await verifyRecaptcha(formData.recaptchaToken);

  const emailService = new EmailService();
  const emailSent = await emailService.sendContactFormEmail({
    name: formData.name,
    email: formData.email,
    subject: formData.subject,
    message: formData.message,
  });

  if (!emailSent) {
    throw new APIError("Failed to send email");
  }

  return createSuccessResponse({ message: "Message sent successfully" });
}

export const POST = withRateLimit("contactForm")(withValidation(handleContactForm, validateContactFormAPI));

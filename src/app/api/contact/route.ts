import type { NextRequest } from "next/server";
import { withValidation } from "@/lib/api/middleware";
import { createSuccessResponse } from "@/lib/api/response";
import { EmailService } from "@/lib/services/email";
import { APIError } from "@/lib/errors";
import { validateContactFormAPI, type ContactFormData } from "@/lib/validation";
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

export const POST = withValidation(handleContactForm, validateContactFormAPI);

import type { NextRequest } from "next/server";
import { apiMiddleware } from "@/lib/api/middleware";
import { createSuccessResponse } from "@/lib/api/response";
import { APIError } from "@/lib/errors";
import { EmailService } from "@/lib/services/email";
import { type ContactFormData, validateContactFormAPI } from "@/lib/validation";
import { verifyRecaptcha } from "@/services/recaptcha.service";

async function handleContactForm(_request: NextRequest, formData: ContactFormData & { recaptchaToken: string }) {
  try {
    await verifyRecaptcha(formData.recaptchaToken);
  } catch (_error) {
    throw new APIError("reCAPTCHA verification failed", 400);
  }

  try {
    const emailService = new EmailService();
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
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError("Failed to process contact form", 500);
  }
}

export const POST = apiMiddleware.withValidation("contactForm", validateContactFormAPI)(handleContactForm);

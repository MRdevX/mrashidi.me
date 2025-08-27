import type { NextRequest } from "next/server";
import { withValidation } from "@/lib/api/middleware";
import { ApiResponseHandler } from "@/lib/api/response";
import { EmailService } from "@/lib/email/email.service";
import { APIError } from "@/lib/errors";
import { validateContactFormAPI } from "@/lib/validation/apiValidators";
import type { ContactFormData } from "@/lib/validation/schemas";
import { RecaptchaService } from "@/server/recaptcha.service";

async function handleContactForm(_request: NextRequest, formData: ContactFormData & { recaptchaToken: string }) {
  await RecaptchaService.verify(formData.recaptchaToken);

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

  return ApiResponseHandler.success({ message: "Message sent successfully" });
}

export const POST = withValidation(handleContactForm, validateContactFormAPI);

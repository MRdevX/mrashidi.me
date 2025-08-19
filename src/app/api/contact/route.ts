import { NextRequest } from "next/server";
import { EmailService } from "@/lib/email/email.service";
import { RecaptchaService } from "@/services/recaptcha.service";
import { validateContactFormAPI } from "@/lib/validation/apiValidators";
import { ContactFormData } from "@/lib/validation/schemas";
import { withValidation } from "@/lib/api/middleware";
import { ApiResponseHandler } from "@/lib/api/response";
import { APIError } from "@/lib/errors";

async function handleContactForm(request: NextRequest, formData: ContactFormData & { recaptchaToken: string }) {
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

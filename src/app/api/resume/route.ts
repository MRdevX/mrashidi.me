import { NextRequest } from "next/server";
import { EmailService } from "@/lib/email/email.service";
import { ResumeRequestValidator } from "@/lib/validation/contactForm";
import { withValidation } from "@/lib/api/middleware";
import { ApiResponseHandler } from "@/lib/api/response";
import { ResumeRequestData } from "@/types/forms";

async function handleResumeRequest(request: NextRequest, formData: ResumeRequestData) {
  const emailService = new EmailService();
  const emailSent = await emailService.sendResumeRequestEmail(formData);

  if (!emailSent) {
    throw new Error("Failed to send resume");
  }

  return ApiResponseHandler.success({ message: "Resume sent successfully" });
}

export const POST = withValidation(handleResumeRequest, ResumeRequestValidator.validate);

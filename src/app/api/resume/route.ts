import type { NextRequest } from "next/server";
import { apiMiddleware } from "@/lib/api/middleware";
import { createSuccessResponse } from "@/lib/api/response";
import { APIError } from "@/lib/errors";
import { EmailService } from "@/lib/services/email";
import { type ResumeRequestData, validateResumeRequestAPI } from "@/lib/validation";

async function handleResumeRequest(_request: NextRequest, formData: ResumeRequestData) {
  const emailService = new EmailService();
  const emailSent = await emailService.sendResumeRequestEmail(formData);

  if (!emailSent) {
    throw new APIError("Failed to send resume");
  }

  return createSuccessResponse({ message: "Resume sent successfully" });
}

export const POST = apiMiddleware.withValidation("contactForm", validateResumeRequestAPI)(handleResumeRequest);

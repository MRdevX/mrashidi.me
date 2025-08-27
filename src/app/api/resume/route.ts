import type { NextRequest } from "next/server";
import { withValidation } from "@/lib/api/middleware";
import { createSuccessResponse } from "@/lib/api/response";
import { EmailService } from "@/lib/email/email.service";
import { APIError } from "@/lib/errors";
import { validateResumeRequestAPI } from "@/lib/validation/apiValidators";
import type { ResumeRequestData } from "@/lib/validation/schemas";

async function handleResumeRequest(_request: NextRequest, formData: ResumeRequestData) {
  const emailService = new EmailService();
  const emailSent = await emailService.sendResumeRequestEmail(formData);

  if (!emailSent) {
    throw new APIError("Failed to send resume");
  }

  return createSuccessResponse({ message: "Resume sent successfully" });
}

export const POST = withValidation(handleResumeRequest, validateResumeRequestAPI);

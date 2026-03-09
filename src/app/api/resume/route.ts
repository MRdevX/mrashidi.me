import type { NextRequest } from "next/server";
import { createMiddleware, type ValidationHandler } from "@/lib/api/middleware";
import { createSuccessResponse } from "@/lib/api/response";
import { APIError } from "@/lib/errors";
import { getEmailService } from "@/lib/services";
import { type ResumeRequestData, validateResumeRequestAPI } from "@/lib/validation";

async function handleResumeRequest(_request: NextRequest, formData: ResumeRequestData) {
  const emailService = getEmailService();
  const emailSent = await emailService.sendResumeRequestEmail(formData);

  if (!emailSent) {
    throw new APIError("Failed to send resume");
  }

  return createSuccessResponse({ message: "Resume sent successfully" });
}

export const POST = createMiddleware("contactForm")
  .validate(validateResumeRequestAPI)
  .build(handleResumeRequest as ValidationHandler<ResumeRequestData>);

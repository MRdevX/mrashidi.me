import type { CvRequestForm } from "@mrashidi/types";
import type { NextRequest } from "next/server";
import { createCvLink } from "@/features/resume/server";
import { createMiddleware } from "@/lib/api/middleware";
import { createSuccessResponse } from "@/lib/api/response";
import { APIError } from "@/lib/errors";
import { getEmailService } from "@/lib/services/factory";
import { validateResumeRequestAPI } from "@/lib/validation";

async function handleResumeRequest(_request: NextRequest, formData: CvRequestForm) {
  const emailService = getEmailService();
  const emailSent = await emailService.sendResumeRequestEmail(formData, createCvLink(Date.now()));

  if (!emailSent) {
    throw new APIError("Failed to send resume");
  }

  return createSuccessResponse({ message: "Resume link sent" });
}

export const POST = createMiddleware("resumeRequest").validate(validateResumeRequestAPI).build(handleResumeRequest);

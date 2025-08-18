import { NextRequest } from "next/server";
import { EmailService } from "@/lib/email/email.service";
import { validateResumeRequestAPI } from "@/lib/validation/apiValidators";
import { ResumeRequestData } from "@/lib/validation/schemas";
import { withValidation } from "@/lib/api/middleware";
import { ApiResponseHandler } from "@/lib/api/response";
import { APIError } from "@/lib/errors";

async function handleResumeRequest(request: NextRequest, formData: ResumeRequestData) {
  const emailService = new EmailService();
  const emailSent = await emailService.sendResumeRequestEmail(formData);

  if (!emailSent) {
    throw new APIError("Failed to send resume");
  }

  return ApiResponseHandler.success({ message: "Resume sent successfully" });
}

export const POST = withValidation(handleResumeRequest, validateResumeRequestAPI);

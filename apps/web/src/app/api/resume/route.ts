import type { CvRequestForm } from "@mrashidi/types";
import type { NextRequest } from "next/server";
import { createCvLink, sendCvLink } from "@/features/resume/server";
import { guardMailRequest } from "@/lib/api/mail-guard";
import { createMiddleware } from "@/lib/api/middleware";
import { createSuccessResponse } from "@/lib/api/response";
import { validateResumeRequestAPI } from "@/lib/validation";

async function handleResumeRequest(
  _request: NextRequest,
  { recaptchaToken, ...form }: CvRequestForm & { recaptchaToken: string }
) {
  await guardMailRequest(recaptchaToken, "cv_request", form.email);
  await sendCvLink({ ...form, cvUrl: createCvLink(Date.now()) });

  return createSuccessResponse({ message: "Resume link sent" });
}

export const POST = createMiddleware("resumeRequest").validate(validateResumeRequestAPI).build(handleResumeRequest);

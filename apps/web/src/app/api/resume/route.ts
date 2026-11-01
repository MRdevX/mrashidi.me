import type { CvRequestForm } from "@mrashidi/types";
import type { NextRequest } from "next/server";
import { createCvLink, sendCvLink } from "@/features/resume/server";
import { createMiddleware } from "@/lib/api/middleware";
import { createSuccessResponse } from "@/lib/api/response";
import { validateResumeRequestAPI } from "@/lib/validation";

async function handleResumeRequest(_request: NextRequest, request: CvRequestForm) {
  await sendCvLink({ ...request, cvUrl: createCvLink(Date.now()) });

  return createSuccessResponse({ message: "Resume link sent" });
}

export const POST = createMiddleware("resumeRequest").validate(validateResumeRequestAPI).build(handleResumeRequest);

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { apiMiddleware } from "@/lib/api/middleware";
import { logger } from "@/lib/core";
import { getCVUrl } from "@/services/blob.service";

const logRedirect = (cvUrl: string) => {
  logger.info({
    operation: "cvDownload",
    status: "redirecting_to_blob",
    url: cvUrl,
  });
};

async function handleCVDownload(_request: NextRequest) {
  const cvUrl = getCVUrl();
  logRedirect(cvUrl);
  return NextResponse.redirect(cvUrl);
}

export const GET = apiMiddleware.basic("generalApi")(handleCVDownload);

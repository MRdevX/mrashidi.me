import type { NextRequest } from "next/server";
import { APIError } from "@/lib/errors";
import { logger } from "@/lib/core";
import { getCVUrl } from "@/server/blob.service";

const logRedirect = (cvUrl: string) => {
  logger.info({
    operation: "cvDownload",
    status: "redirecting_to_blob",
    url: cvUrl,
  });
};

export async function GET(_request: NextRequest) {
  try {
    const cvUrl = getCVUrl();
    logRedirect(cvUrl);
    return Response.redirect(cvUrl);
  } catch (error) {
    logger.error({
      operation: "cvDownload",
      status: "error",
      error: error instanceof Error ? error.message : String(error),
    });

    throw new APIError("Failed to get CV download URL");
  }
}

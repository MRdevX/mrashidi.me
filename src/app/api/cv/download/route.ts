import { NextRequest } from "next/server";
import { BlobService } from "@/services/blob.service";
import { APIError } from "@/lib/errors";
import { logger } from "@/lib/utils/logger";

export async function GET(_request: NextRequest) {
  try {
    const cvUrl = BlobService.getCVUrl();

    logger.info({
      operation: "cvDownload",
      status: "redirecting_to_blob",
      url: cvUrl,
    });

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

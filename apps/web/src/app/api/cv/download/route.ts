import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { SITE_URL } from "@/data";
import { verifyCvToken } from "@/features/resume/server";
import { createMiddleware } from "@/lib/api/middleware";
import { logger } from "@/lib/core";
import { APIError } from "@/lib/errors";
import { CV_FILE_NAME, readCV } from "@/lib/services/blob";

const REQUEST_AGAIN = `Request a new one at ${SITE_URL}/resume`;

async function handleCVDownload(request: NextRequest) {
  const check = verifyCvToken(request.nextUrl.searchParams.get("token"), Date.now());
  if (!check.ok) {
    logger.info({ operation: "cvDownload", status: "rejected", reason: check.reason });
    throw check.reason === "expired"
      ? new APIError(`This CV link has expired. ${REQUEST_AGAIN}`, 410)
      : new APIError(`This CV link is not valid. ${REQUEST_AGAIN}`, 403);
  }

  const stream = await readCV();
  logger.info({ operation: "cvDownload", status: "served" });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${CV_FILE_NAME}"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export const GET = createMiddleware("generalApi").build(handleCVDownload);

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { withRateLimit } from "@/lib/api/middleware";
import { withSecurityHeaders } from "@/lib/api/securityHeaders";
import { logger } from "@/lib/core";
import { APIError } from "@/lib/errors";
import { uploadCV } from "@/services/blob.service";
import { pdfUploadSecurity } from "@/services/upload-security.service";

const validateAuth = (request: NextRequest): void => {
  const authHeader = request.headers.get("authorization");
  const expectedToken = process.env.CV_UPLOAD_TOKEN;

  if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
    logger.warn({
      operation: "cvUpload",
      status: "unauthorized",
      headers: request.headers.get("x-forwarded-for") || "unknown",
    });
    throw new APIError("Unauthorized", 401);
  }
};

const validateFile = async (file: File | null): Promise<File> => {
  if (!file) {
    throw new APIError("No file provided", 400);
  }

  const validationResult = await pdfUploadSecurity.validateFile(file);

  if (!validationResult.isValid) {
    throw new APIError(`File validation failed: ${validationResult.errors.join(", ")}`, 400);
  }

  return file;
};

const logSuccess = (url: string, file: File) => {
  logger.info({
    operation: "cvUpload",
    status: "success",
    url,
    fileName: file.name,
    fileSize: file.size,
  });
};

async function handleCVUpload(request: NextRequest) {
  try {
    validateAuth(request);

    const formData = await request.formData();
    const file = await validateFile(formData.get("file") as File);
    const url = await uploadCV(file);

    logSuccess(url, file);

    return NextResponse.json({
      success: true,
      message: "CV uploaded and replaced successfully",
      url,
    });
  } catch (error) {
    logger.error({
      operation: "cvUpload",
      status: "failed",
      error: error instanceof Error ? error.message : String(error),
    });

    if (error instanceof APIError) {
      throw error;
    }

    throw new APIError("Failed to upload CV");
  }
}

export const POST = withSecurityHeaders(withRateLimit("cvUpload")(handleCVUpload));

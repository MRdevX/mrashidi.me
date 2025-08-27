import type { NextRequest } from "next/server";
import { APIError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { uploadCV } from "@/server/blob.service";

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

const validateFile = (file: File | null): File => {
  if (!file) {
    throw new APIError("No file provided", 400);
  }

  if (!file.type.includes("pdf")) {
    throw new APIError("File must be a PDF", 400);
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

export async function POST(request: NextRequest) {
  try {
    validateAuth(request);

    const formData = await request.formData();
    const file = validateFile(formData.get("file") as File);
    const url = await uploadCV(file);

    logSuccess(url, file);

    return Response.json({
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

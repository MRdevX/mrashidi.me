import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { apiMiddleware } from "@/lib/api/middleware";
import { logger } from "@/lib/core";
import { APIError } from "@/lib/errors";
import { uploadCV } from "@/services/blob.service";
import { pdfUploadSecurity } from "@/services/upload-security.service";

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
  const formData = await request.formData();
  const file = await validateFile(formData.get("file") as File);
  const url = await uploadCV(file);

  logSuccess(url, file);

  return NextResponse.json({
    success: true,
    message: "CV uploaded and replaced successfully",
    url,
  });
}

export const POST = apiMiddleware.withAuth("cvUpload", process.env.CV_UPLOAD_TOKEN || "")(handleCVUpload);

import { get, put } from "@vercel/blob";
import { logger } from "@/lib/core";
import { APIError } from "@/lib/errors";

export const CV_FILE_NAME = "Mahdi_Rashidi_CV.pdf";
const CV_PATH = `cv/${CV_FILE_NAME}`;

export async function readCV(): Promise<ReadableStream<Uint8Array>> {
  const result = await get(CV_PATH, { access: "private", useCache: false });
  if (result?.statusCode !== 200) {
    throw new APIError("CV not found", 404);
  }
  return result.stream;
}

export async function uploadCV(file: File | Buffer): Promise<string> {
  try {
    const blob = await put(CV_PATH, file, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/pdf",
    });

    logger.info({
      operation: "uploadCV",
      status: "success",
      pathname: blob.pathname,
      size: file instanceof File ? file.size : file.length,
    });

    return blob.pathname;
  } catch (error) {
    logger.error({
      operation: "uploadCV",
      status: "failed",
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

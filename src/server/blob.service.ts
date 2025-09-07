import { put } from "@vercel/blob";
import { logger } from "@/lib/core";

const CV_PATH = "cv/Dee_Rashidi_CV.pdf";

export function getCVUrl(): string {
  const blobStoreUrl = process.env.BLOB_STORE_URL;

  if (!blobStoreUrl) {
    throw new Error("BLOB_STORE_URL environment variable is not configured");
  }

  return `${blobStoreUrl}/${CV_PATH}`;
}

export async function uploadCV(file: File | Buffer): Promise<string> {
  try {
    const blob = await put(CV_PATH, file, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/pdf",
    });

    logger.info({
      operation: "uploadCV",
      status: "success",
      url: blob.url,
      size: file instanceof File ? file.size : file.length,
    });

    return blob.url;
  } catch (error) {
    logger.error({
      operation: "uploadCV",
      status: "failed",
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

import { put } from "@vercel/blob";
import { getRequiredEnv, logger } from "@/lib/core";

const CV_PATH = "cv/Mahdi_Rashidi_CV.pdf";

export function getCVUrl(): string {
  const blobStoreUrl = getRequiredEnv("BLOB_STORE_URL");
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

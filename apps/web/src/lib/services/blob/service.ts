import { put } from "@vercel/blob";
import { getRequiredEnv, logger } from "@/lib/core";

const CV_PATH = "cv/Mahdi_Rashidi_CV.pdf";
const CV_CACHE_MAX_AGE_SECONDS = 300;

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
      // The CV is overwritten in place whenever it is rebuilt, so the blob
      // default of a month would leave already-cached copies stale.
      cacheControlMaxAge: CV_CACHE_MAX_AGE_SECONDS,
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

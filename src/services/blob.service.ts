import { put } from "@vercel/blob";
import { logger } from "@/lib/utils/logger";

export class BlobService {
  private static readonly CV_PATH = "cv/Mahdi_Rashidi_CV.pdf";

  static getCVUrl(): string {
    const blobStoreUrl = process.env.BLOB_STORE_URL;

    if (!blobStoreUrl) {
      throw new Error("BLOB_STORE_URL environment variable is not configured");
    }

    return `${blobStoreUrl}/${this.CV_PATH}`;
  }

  static async uploadCV(file: File | Buffer): Promise<string> {
    try {
      const blob = await put(this.CV_PATH, file, {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
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
}

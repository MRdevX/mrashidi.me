import type { CvRequestForm } from "@mrashidi/types";
import { logger } from "@/lib/core";

export async function submitResumeRequest(data: CvRequestForm): Promise<boolean> {
  try {
    const response = await fetch("/api/resume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      return true;
    }
    const errorData = await response.json();
    logger.error({
      operation: "handleResumeRequest",
      status: "failed",
      errorData,
    });
    return false;
  } catch (error) {
    logger.error({
      operation: "handleResumeRequest",
      status: "error",
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

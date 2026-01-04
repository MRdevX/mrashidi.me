import { API_CONFIG, getRequiredEnv, logger } from "@/lib/core";
import { NetworkError, ValidationError } from "@/lib/errors";

interface RecaptchaResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  error_codes?: string[];
}

const VERIFY_URL = API_CONFIG.RECAPTCHA.VERIFY_URL;
const THRESHOLD = API_CONFIG.RECAPTCHA.THRESHOLD;

export async function verifyRecaptcha(token: string): Promise<boolean> {
  if (token === "no-recaptcha") {
    logger.warn("reCAPTCHA verification skipped - running in fallback mode");
    return true;
  }

  const secretKey = getRequiredEnv("RECAPTCHA_SECRET_KEY");

  const response = await fetch(VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${secretKey}&response=${token}`,
  });

  if (!response.ok) {
    throw new NetworkError("Failed to verify reCAPTCHA");
  }

  const data: RecaptchaResponse = await response.json();

  if (!data.success) {
    throw new ValidationError("reCAPTCHA verification failed");
  }

  if (data.score < THRESHOLD) {
    throw new ValidationError("Suspicious activity detected. Please try again.");
  }

  return true;
}

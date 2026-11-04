import { isSiteHostname } from "@/lib/api/cors-allowlist";
import { API_CONFIG, getRequiredEnv } from "@/lib/core";
import { NetworkError, ValidationError } from "@/lib/errors";

interface RecaptchaResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  error_codes?: string[];
}

export type RecaptchaAction = "contact" | "cv_request";

const VERIFY_URL = API_CONFIG.RECAPTCHA.VERIFY_URL;
const THRESHOLD = API_CONFIG.RECAPTCHA.THRESHOLD;

export async function verifyRecaptcha(token: string, expectedAction: RecaptchaAction): Promise<void> {
  const response = await fetch(VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret: getRequiredEnv("RECAPTCHA_SECRET_KEY"), response: token }).toString(),
  });

  if (!response.ok) {
    throw new NetworkError("Failed to verify reCAPTCHA");
  }

  const data: RecaptchaResponse = await response.json();

  if (!data.success || data.action !== expectedAction || !isSiteHostname(data.hostname)) {
    throw new ValidationError("reCAPTCHA verification failed");
  }

  if (data.score < THRESHOLD) {
    throw new ValidationError("Suspicious activity detected. Please try again.");
  }
}

import { APIError } from "@/lib/errors";
import { checkRateLimit } from "@/lib/services/rate-limit";
import { type RecaptchaAction, verifyRecaptcha } from "@/lib/services/recaptcha";

export async function guardMailRequest(recaptchaToken: string, action: RecaptchaAction, recipient: string) {
  try {
    await verifyRecaptcha(recaptchaToken, action);
  } catch (_error) {
    throw new APIError("reCAPTCHA verification failed", 400);
  }

  const { success } = await checkRateLimit("mailRecipient", recipient);
  if (!success) {
    throw new APIError("Too many emails to this address today. Please try again tomorrow.", 429);
  }
}

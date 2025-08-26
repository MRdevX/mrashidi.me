import { API_CONFIG } from "@/lib/config/api";
import { AuthenticationError, NetworkError, ValidationError } from "@/lib/errors";

interface RecaptchaResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  error_codes?: string[];
}

export class RecaptchaService {
  private static readonly VERIFY_URL = API_CONFIG.RECAPTCHA.VERIFY_URL;
  private static readonly THRESHOLD = API_CONFIG.RECAPTCHA.THRESHOLD;

  static async verify(token: string): Promise<boolean> {
    if (!process.env.RECAPTCHA_SECRET_KEY) {
      throw new AuthenticationError("reCAPTCHA secret key not configured");
    }

    const response = await fetch(`${this.VERIFY_URL}?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new NetworkError("Failed to verify reCAPTCHA");
    }

    const data: RecaptchaResponse = await response.json();

    if (!data.success) {
      throw new ValidationError("reCAPTCHA verification failed");
    }

    if (data.score < this.THRESHOLD) {
      throw new ValidationError("Suspicious activity detected. Please try again.");
    }

    return true;
  }
}

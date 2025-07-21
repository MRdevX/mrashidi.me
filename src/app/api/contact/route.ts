import { NextResponse } from "next/server";
import { EmailService } from "@/lib/email/email.service";
import { ErrorHandler } from "@/lib/errors";

const RECAPTCHA_THRESHOLD = 0.5; // Minimum score to accept (0.0 to 1.0)

interface RecaptchaResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  error_codes?: string[];
}

export async function POST(request: Request) {
  try {
    const { name, email, subject, message, recaptchaToken } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Verify reCAPTCHA
    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      { method: "POST" }
    );

    const recaptchaData = (await recaptchaResponse.json()) as RecaptchaResponse;

    if (!recaptchaData.success) {
      return NextResponse.json({ error: "reCAPTCHA verification failed" }, { status: 400 });
    }

    // Check reCAPTCHA score
    if (recaptchaData.score < RECAPTCHA_THRESHOLD) {
      return NextResponse.json({ error: "Suspicious activity detected. Please try again." }, { status: 400 });
    }

    // Initialize email service
    const emailService = new EmailService();

    // Send emails
    const emailSent = await emailService.sendContactFormEmail({
      name,
      email,
      subject,
      message,
    });

    if (!emailSent) {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ message: "Message sent successfully" }, { status: 200 });
  } catch (error) {
    const appError = ErrorHandler.handle(error);
    ErrorHandler.log(appError, "Contact API");
    return NextResponse.json({ error: appError.message }, { status: appError.statusCode || 500 });
  }
}

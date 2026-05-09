"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { ContactFormRefactored as ContactForm } from "@/components/forms/ContactForm";
import { getEnv } from "@/lib/core";

export function ContactFormGate() {
  const recaptchaSiteKey = getEnv("NEXT_PUBLIC_RECAPTCHA_SITE_KEY");

  if (recaptchaSiteKey) {
    return (
      <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
        <ContactForm />
      </GoogleReCaptchaProvider>
    );
  }

  return (
    <div className="relative isolate z-0 p-6 feature-card">
      <p className="relative z-10 text-red-500">Contact form is temporarily unavailable. Please try again later.</p>
    </div>
  );
}

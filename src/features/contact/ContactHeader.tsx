"use client";

import { motion, useReducedMotion } from "framer-motion";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { ContactFormRefactored as ContactForm } from "@/components/forms/ContactForm";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { pageEnterTransition } from "@/lib/animations";
import { getEnv } from "@/lib/core";

interface ContactHeaderProps {
  description: string;
}

export function ContactHeader({ description }: ContactHeaderProps) {
  const recaptchaSiteKey = getEnv("NEXT_PUBLIC_RECAPTCHA_SITE_KEY");
  const { getTextColor } = useThemeConfig();
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="space-y-12">
      <motion.p
        className={`${getTextColor("secondary")} mb-8`}
        initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={pageEnterTransition(prefersReducedMotion, { delay: 0.18 })}
      >
        {description}
      </motion.p>

      {/* Contact Form Section */}
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={pageEnterTransition(prefersReducedMotion, { delay: 0.22 })}
      >
        {recaptchaSiteKey && (
          <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
            <ContactForm />
          </GoogleReCaptchaProvider>
        )}
        {!recaptchaSiteKey && (
          <div className="feature-card relative isolate z-0 p-6">
            <p className="relative z-10 text-red-500">
              Contact form is temporarily unavailable. Please try again later.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

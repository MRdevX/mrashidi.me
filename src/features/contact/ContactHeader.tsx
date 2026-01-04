"use client";

import { motion } from "framer-motion";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { ContactFormRefactored as ContactForm } from "@/components/forms/ContactForm";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { getEnv } from "@/lib/core";

interface ContactHeaderProps {
  description: string;
}

export function ContactHeader({ description }: ContactHeaderProps) {
  const recaptchaSiteKey = getEnv("NEXT_PUBLIC_RECAPTCHA_SITE_KEY");
  const { getTextColor } = useThemeConfig();

  return (
    <div className="space-y-12">
      <motion.p
        className={`${getTextColor("secondary")} mb-8`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {description}
      </motion.p>

      {/* Contact Form Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        {recaptchaSiteKey && (
          <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
            <ContactForm />
          </GoogleReCaptchaProvider>
        )}
        {!recaptchaSiteKey && (
          <div className="glass-card p-6">
            <p className="text-red-500">Contact form is temporarily unavailable. Please try again later.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

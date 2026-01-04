"use client";

import { motion } from "framer-motion";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { ContactFormRefactored as ContactForm } from "@/components/forms/ContactForm";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import type { ContactSection } from "./types";

interface ContactHeaderProps {
  title: string;
  description: string;
  sections?: ContactSection[];
}

export function ContactHeader({ description }: ContactHeaderProps) {
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
        {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
          <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
            <ContactForm />
          </GoogleReCaptchaProvider>
        )}
        {!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
          <div className="glass-card p-6">
            <p className="text-red-500">Contact form is temporarily unavailable. Please try again later.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

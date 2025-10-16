"use client";

import { motion } from "framer-motion";
import { ContactFormRefactored as ContactForm } from "@/components/forms/ContactForm";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import type { ContactSection } from "./types";

interface ContactHeaderProps {
  title: string;
  description: string;
  sections?: ContactSection[];
}

export function ContactHeader({ description, sections }: ContactHeaderProps) {
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
        <ContactForm />
      </motion.div>
    </div>
  );
}

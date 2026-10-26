"use client";

import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CyberpunkButton, MotionSection, SectionHeader } from "@/components/ui";
import { useContent } from "@/lib/content";

type HomeContactSectionProps = {
  variants: Variants;
  reducedMotion: boolean;
};

export function HomeContactSection({ variants, reducedMotion }: HomeContactSectionProps) {
  const { about } = useContent();
  return (
    <MotionSection className="text-center" variants={variants}>
      <div className="contact-section content-section">
        <div className="contact-section-background" />
        <div className="contact-content">
          <SectionHeader iconName="MessageCircle" title={about.contactCta} size="lg" className="justify-center" />
          <p className="contact-description text-body">{about.contactDescription}</p>
          <motion.div
            className="inline-block"
            {...(!reducedMotion ? { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } } : {})}
          >
            <CyberpunkButton
              asChild
              variant="neon"
              icon={<ArrowRight className="size-5" aria-hidden />}
              iconPosition="right"
              className="px-8 py-3 text-lg"
            >
              <Link href="/contact">Get In Touch</Link>
            </CyberpunkButton>
          </motion.div>
        </div>
      </div>
    </MotionSection>
  );
}

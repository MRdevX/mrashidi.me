"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getThemeConfig } from "@/config/theme.config";
import { useContent } from "@/lib/content";
import { detectDeviceCapabilities } from "@/lib/utils/performance";

export const BrandLogo = () => {
  const { profile } = useContent();
  const { getSectionTitle, getColor } = getThemeConfig();
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    const { isLowEnd } = detectDeviceCapabilities();
    setIsLowPerformance(isLowEnd);
  }, []);

  return (
    <Link href="/" className="flex items-center shrink-0 group" aria-label={`${profile.person.name} - Home`}>
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.span
          className={`text-lg font-bold ${getSectionTitle()} relative z-10`}
          whileHover={
            !isLowPerformance
              ? {
                  scale: 1.02,
                  textShadow: `0 0 4px ${getColor("primary")}66`,
                }
              : {}
          }
          whileTap={!isLowPerformance ? { scale: 0.98 } : {}}
          transition={{ duration: 0.15 }}
        >
          MR
        </motion.span>

        {!isLowPerformance && (
          <>
            <motion.div
              className="absolute -inset-1 bg-primary/10 rounded-md blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              initial={false}
            />
          </>
        )}
      </motion.div>
    </Link>
  );
};

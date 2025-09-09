"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { performanceUtils } from "@/lib/utils/performance";

export const BrandLogo = () => {
  const { getSectionTitle, getColor } = useThemeConfig();
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    const { isLowEnd } = performanceUtils.detectDeviceCapabilities();
    setIsLowPerformance(isLowEnd);
  }, []);

  return (
    <Link href="/" className="flex items-center shrink-0 group" aria-label="Mahdi Rashidi - Home">
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

        {/* Simplified effects for better performance */}
        {!isLowPerformance && (
          <>
            <motion.div
              className="absolute -inset-1 bg-orange-500/10 rounded-md blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              initial={false}
            />
            {/* Removed the infinite animation for better performance */}
          </>
        )}
      </motion.div>
    </Link>
  );
};

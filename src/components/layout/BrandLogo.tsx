"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useThemeConfig } from "@/hooks/useThemeConfig";

export const BrandLogo = () => {
  const { getSectionTitle } = useThemeConfig();

  return (
    <Link href="/" className="flex items-center shrink-0 group" aria-label="Mahdi Rashidi - Home">
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.span
          className="text-lg font-bold text-orange-500 font-cyberpunk tracking-wider relative z-10"
          whileHover={{
            scale: 1.05,
            textShadow: "0 0 8px rgba(255, 95, 31, 0.6)",
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          MR
        </motion.span>
        <motion.div
          className="absolute -inset-1 bg-orange-500/20 rounded-md blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/10 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          initial={false}
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </Link>
  );
};

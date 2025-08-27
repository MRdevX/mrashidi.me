"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useThemeConfig } from "@/hooks/useThemeConfig";

export function BlogHeader() {
  const { getSectionTitle } = useThemeConfig();

  return (
    <motion.div
      className="flex items-center gap-3 mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <BookOpen className="w-8 h-8 text-orange-500" />
      <h1 className={`text-4xl font-bold ${getSectionTitle()}`}>Blog Posts</h1>
    </motion.div>
  );
}

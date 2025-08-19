"use client";

import { motion } from "framer-motion";

export function BlogError() {
  return (
    <motion.div className="text-center text-red-500 py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      Failed to fetch blog posts. Please try again later.
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui";

interface BlogErrorProps {
  onRetry?: () => void;
}

export function BlogError({ onRetry }: BlogErrorProps) {
  return (
    <motion.div className="text-center py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="text-red-500 mb-4">Failed to fetch blog posts. Please try again later.</div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          Try Again
        </Button>
      )}
    </motion.div>
  );
}

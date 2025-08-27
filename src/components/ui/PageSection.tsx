import { motion } from "framer-motion";
import { ReactNode } from "react";
import { fadeInVariants } from "@/lib/animations";

interface PageSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function PageSection({ children, className = "", delay = 0 }: PageSectionProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      <div className="page-section">{children}</div>
    </motion.div>
  );
}

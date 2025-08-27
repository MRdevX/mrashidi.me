import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface MotionSectionProps {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
}

export function MotionSection({ children, variants, className = "", delay = 0 }: MotionSectionProps) {
  return (
    <motion.div variants={variants} transition={{ duration: 0.5, delay }} className={className}>
      {children}
    </motion.div>
  );
}

import { motion } from "framer-motion";
import { fadeInVariants } from "@/lib/animations";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variants?: typeof fadeInVariants;
}

export function AnimatedSection({
  children,
  className = "mb-12",
  delay = 0,
  variants = fadeInVariants,
}: AnimatedSectionProps) {
  return (
    <motion.section className={className} initial="hidden" animate="visible" variants={variants} transition={{ delay }}>
      {children}
    </motion.section>
  );
}

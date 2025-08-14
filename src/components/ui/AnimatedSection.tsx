import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  animation?: "fadeIn" | "slideUp" | "slideIn" | "scaleIn";
}

const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  },
  slideIn: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 },
  },
};

export default function AnimatedSection({
  children,
  delay = 0,
  duration,
  className = "",
  animation = "fadeIn",
  ...props
}: AnimatedSectionProps) {
  const animationConfig = animations[animation];

  return (
    <motion.div
      className={cn("", className)}
      initial={animationConfig.initial}
      animate={animationConfig.animate}
      transition={{
        ...animationConfig.transition,
        delay,
        duration: duration || animationConfig.transition.duration,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

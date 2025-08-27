"use client";

import { ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { animationClasses, staggerDelays } from "@/lib/animations";

interface PerformanceWrapperProps {
  children: ReactNode;
  animation?: "fadeIn" | "slideUp" | "slideDown" | "scaleIn" | "none";
  delay?: number;
  className?: string;
  useFramerMotion?: boolean;
  framerMotionProps?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initial?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    animate?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transition?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variants?: any;
  };
}

export function PerformanceWrapper({
  children,
  animation = "fadeIn",
  delay = 0,
  className = "",
  useFramerMotion = false,
  framerMotionProps = {},
}: PerformanceWrapperProps) {
  const [_mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!useFramerMotion) {
    const animationClass = animation === "none" ? "" : animationClasses[animation];

    const delayClass = delay > 0 ? `animate-delay-[${delay * 1000}ms]` : "";

    return <div className={`${animationClass} ${delayClass} ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={framerMotionProps.initial || { opacity: 0 }}
      animate={framerMotionProps.animate || { opacity: 1 }}
      transition={framerMotionProps.transition || { delay, duration: 0.3 }}
      variants={framerMotionProps.variants}
    >
      {children}
    </motion.div>
  );
}

interface StaggerWrapperProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: keyof typeof staggerDelays;
}

export function StaggerWrapper({ children, className = "", staggerDelay = "normal" }: StaggerWrapperProps) {
  return (
    <div className={className}>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <PerformanceWrapper key={index} animation="slideUp" delay={index * staggerDelays[staggerDelay]}>
              {child}
            </PerformanceWrapper>
          ))
        : children}
    </div>
  );
}

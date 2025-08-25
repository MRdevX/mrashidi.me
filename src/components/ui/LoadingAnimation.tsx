"use client";

import { motion, Variants } from "framer-motion";
import { useThemeConfig } from "@/hooks/useThemeConfig";

interface LoadingAnimationProps {
  size?: "small" | "medium" | "large";
  color?: "orange" | "green" | "blue" | "white";
  text?: string;
  fullScreen?: boolean;
}

const LoadingAnimation = ({
  size = "medium",
  color = "orange",
  text = "Loading...",
  fullScreen = false,
}: LoadingAnimationProps) => {
  const { colors, getTextColor } = useThemeConfig();

  const sizeValues = {
    small: {
      container: "w-4 h-4",
      dot: "w-1 h-1",
    },
    medium: {
      container: "w-8 h-8",
      dot: "w-2 h-2",
    },
    large: {
      container: "w-12 h-12",
      dot: "w-3 h-3",
    },
  };

  const colorValues = {
    orange: `bg-[${colors.primary.DEFAULT}]`,
    green: `bg-[${colors.success.DEFAULT}]`,
    blue: `bg-[${colors.info.DEFAULT}]`,
    white: "bg-white",
  };

  const containerVariants: Variants = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const dotVariants: Variants = {
    initial: {
      y: "0%",
    },
    animate: {
      y: ["0%", "-100%", "0%"],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div
      className={`flex flex-col items-center justify-center ${
        fullScreen ? "fixed inset-0 bg-black/80 backdrop-blur-sm z-50" : ""
      }`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <motion.div
        className={`flex items-center justify-center gap-2 ${sizeValues[size].container}`}
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={`${sizeValues[size].dot} ${colorValues[color]} rounded-full`}
            variants={dotVariants}
            animate="animate"
            initial="initial"
            custom={i}
          />
        ))}
      </motion.div>
      {text && (
        <div className="mt-3 text-center">
          <span className={`${getTextColor("secondary")} text-sm`}>{text}</span>
        </div>
      )}
      <div className="sr-only">Loading content, please wait</div>
    </div>
  );
};

export { LoadingAnimation };

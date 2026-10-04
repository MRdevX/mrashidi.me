"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  Award,
  BookOpen,
  Briefcase,
  Code2,
  GraduationCap,
  Languages,
  MessageCircle,
  Terminal,
} from "lucide-react";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { pageEnterTransition } from "@/lib/animations";

const iconMap = {
  Activity,
  Award,
  BookOpen,
  Briefcase,
  Code2,
  GraduationCap,
  Languages,
  MessageCircle,
  Terminal,
} as const;

type IconName = keyof typeof iconMap;

interface SectionHeaderProps {
  iconName: IconName;
  title: string;
  className?: string;
  delay?: number;
  size?: "sm" | "md" | "lg";
  /** Heading level; defaults to `h1` for existing callers. */
  as?: "h1" | "h2" | "h3";
}

export function SectionHeader({
  iconName,
  title,
  className = "",
  delay = 0,
  size = "md",
  as: HeadingTag = "h1",
}: SectionHeaderProps) {
  const { getSectionTitle } = useThemeConfig();
  const Icon = iconMap[iconName];
  const prefersReducedMotion = useReducedMotion();

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const titleSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl sm:text-4xl",
  };

  const defaultSpacing = "mb-8";

  return (
    <motion.div
      className={`flex items-center gap-3 ${defaultSpacing} ${className}`}
      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={pageEnterTransition(prefersReducedMotion, { delay })}
    >
      <Icon className={`${sizeClasses[size]} text-orange-500`} aria-hidden />
      <HeadingTag className={`${titleSizes[size]} font-bold ${getSectionTitle()}`}>{title}</HeadingTag>
    </motion.div>
  );
}

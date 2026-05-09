"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, FolderOpen, GitFork, MessageCircle, Share2, User } from "lucide-react";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { fadeInVariants, reducedMotionFadeVariants } from "@/lib/animations";

const iconMap = {
  User,
  MessageCircle,
  BookOpen,
  FolderOpen,
  Share2,
  GitFork,
} as const;

type IconName = keyof typeof iconMap;

interface PageHeaderProps {
  iconName: IconName;
  title: string;
  className?: string;
  /** Use `"h2"` when this route already has a page `<h1>` (single h1 per page for accessibility). */
  titleHeading?: "h1" | "h2";
}

export function PageHeader({ iconName, title, className = "", titleHeading = "h1" }: PageHeaderProps) {
  const { getSectionTitle } = useThemeConfig();
  const Icon = iconMap[iconName];
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? reducedMotionFadeVariants : fadeInVariants;
  const HeadingTag = titleHeading;

  return (
    <motion.div initial="hidden" animate="visible" variants={variants} className={className}>
      <div className="page-header">
        <Icon className="page-header-icon" />
        <HeadingTag className={`text-3xl sm:text-4xl font-bold ${getSectionTitle()} text-center sm:text-left`}>
          {title}
        </HeadingTag>
      </div>
    </motion.div>
  );
}

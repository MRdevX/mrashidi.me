"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, FileText, FolderOpen, GitFork, MessageCircle, Share2, User } from "lucide-react";
import type { ReactNode } from "react";
import { getThemeConfig } from "@/config/theme.config";
import { fadeInVariants, reducedMotionFadeVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";

const iconMap = {
  User,
  MessageCircle,
  BookOpen,
  FolderOpen,
  Share2,
  GitFork,
  FileText,
} as const;

type IconName = keyof typeof iconMap;

interface PageHeaderProps {
  iconName: IconName;
  title: string;
  className?: string;
  /** Use `"h2"` when this route already has a page `<h1>` (single h1 per page for accessibility). */
  titleHeading?: "h1" | "h2";
  actions?: ReactNode;
}

export function PageHeader({ iconName, title, className = "", titleHeading = "h1", actions }: PageHeaderProps) {
  const { getSectionTitle } = getThemeConfig();
  const Icon = iconMap[iconName];
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? reducedMotionFadeVariants : fadeInVariants;
  const HeadingTag = titleHeading;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      className={cn(
        actions && "mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between [&_.page-header]:mb-0",
        className
      )}
    >
      <div className="page-header">
        <Icon className="page-header-icon" aria-hidden />
        <HeadingTag className={`text-3xl sm:text-4xl font-bold ${getSectionTitle()} text-center sm:text-left`}>
          {title}
        </HeadingTag>
      </div>
      {actions}
    </motion.div>
  );
}

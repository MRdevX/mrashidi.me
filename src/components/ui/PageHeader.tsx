"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, FolderOpen, MessageCircle, User } from "lucide-react";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { fadeInVariants, reducedMotionFadeVariants } from "@/lib/animations";

const iconMap = {
  User,
  MessageCircle,
  BookOpen,
  FolderOpen,
} as const;

type IconName = keyof typeof iconMap;

interface PageHeaderProps {
  iconName: IconName;
  title: string;
  className?: string;
}

export function PageHeader({ iconName, title, className = "" }: PageHeaderProps) {
  const { getSectionTitle } = useThemeConfig();
  const Icon = iconMap[iconName];
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? reducedMotionFadeVariants : fadeInVariants;

  return (
    <motion.div initial="hidden" animate="visible" variants={variants} className={className}>
      <div className="page-header">
        <Icon className="page-header-icon" />
        <h1 className={`text-3xl sm:text-4xl font-bold ${getSectionTitle()} text-center sm:text-left`}>{title}</h1>
      </div>
    </motion.div>
  );
}

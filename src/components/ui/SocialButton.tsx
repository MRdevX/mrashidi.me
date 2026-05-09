"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";
import { NewTabSrOnly } from "@/lib/a11y/new-tab-hint";
import { cn } from "@/lib/utils";
import { CyberpunkButton } from "./CyberpunkButton";

interface SocialButtonProps {
  href: string;
  icon: LucideIcon | IconType;
  children: React.ReactNode;
  isExternal?: boolean;
  className?: string;
}

export function SocialButton({ href, icon: Icon, children, isExternal = true, className = "" }: SocialButtonProps) {
  const linkProps = isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {};
  const prefersReducedMotion = useReducedMotion();
  const motionInteractive = prefersReducedMotion ? {} : { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } };

  return (
    <motion.div {...motionInteractive}>
      <CyberpunkButton
        asChild
        variant="neon"
        icon={<Icon className="w-4 h-4" aria-hidden />}
        className={cn("w-full sm:w-auto", className)}
      >
        <a href={href} {...linkProps}>
          {children}
          {isExternal ? <NewTabSrOnly /> : null}
        </a>
      </CyberpunkButton>
    </motion.div>
  );
}

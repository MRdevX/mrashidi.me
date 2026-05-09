"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";
import type { CardVariant } from "@/config/theme.config";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { PAGE_TRANSITION_EASE } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./Card";

interface CyberpunkCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: CardVariant;
  hover?: boolean;
  animate?: boolean;
}

export const CyberpunkCard = React.forwardRef<HTMLDivElement, CyberpunkCardProps>(
  ({ children, className, variant = "default", hover = false, animate = false, ...props }, ref) => {
    const { getCardVariant } = useThemeConfig();
    const prefersReducedMotion = useReducedMotion();

    const cardElement = (
      <Card
        ref={ref}
        className={cn(
          "transition-all duration-300 ease-out",
          getCardVariant(variant),
          hover && "motion-safe:hover:scale-[1.01] hover:shadow-lg",
          className
        )}
        {...props}
      >
        {children}
      </Card>
    );

    if (animate && hover) {
      return (
        <motion.div
          whileHover={prefersReducedMotion ? undefined : { scale: 1.01 }}
          transition={{ duration: 0.22, ease: PAGE_TRANSITION_EASE }}
        >
          {cardElement}
        </motion.div>
      );
    }

    return cardElement;
  }
);

CyberpunkCard.displayName = "CyberpunkCard";

export const CyberpunkCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { getBorderColor } = useThemeConfig();
    return <CardHeader ref={ref} className={cn(`border-b ${getBorderColor("primary")}`, className)} {...props} />;
  }
);
CyberpunkCardHeader.displayName = "CyberpunkCardHeader";

export const CyberpunkCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    const { getSectionTitle } = useThemeConfig();
    return <CardTitle ref={ref} className={cn(getSectionTitle(), className)} {...props} />;
  }
);
CyberpunkCardTitle.displayName = "CyberpunkCardTitle";

export const CyberpunkCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { getTextColor } = useThemeConfig();
  return <CardDescription ref={ref} className={cn(getTextColor("secondary"), className)} {...props} />;
});
CyberpunkCardDescription.displayName = "CyberpunkCardDescription";

export const CyberpunkCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { getTextColor } = useThemeConfig();
    return <CardContent ref={ref} className={cn(getTextColor("primary"), className)} {...props} />;
  }
);
CyberpunkCardContent.displayName = "CyberpunkCardContent";

export const CyberpunkCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { getBorderColor } = useThemeConfig();
    return <CardFooter ref={ref} className={cn(`border-t ${getBorderColor("primary")}`, className)} {...props} />;
  }
);
CyberpunkCardFooter.displayName = "CyberpunkCardFooter";

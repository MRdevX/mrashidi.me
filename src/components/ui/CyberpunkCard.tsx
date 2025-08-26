"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./Card";
import { cn } from "@/lib/utils";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import type { CardVariant } from "@/config/theme.config";

interface CyberpunkCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: CardVariant;
  hover?: boolean;
  animate?: boolean;
}

export const CyberpunkCard = React.forwardRef<HTMLDivElement, CyberpunkCardProps>(
  ({ children, className, variant = "default", hover = false, animate = true, ...props }, ref) => {
    const { getCardVariant } = useThemeConfig();

    const cardElement = (
      <Card
        ref={ref}
        className={cn(
          "transition-all duration-300",
          getCardVariant(variant),
          hover && "hover:scale-[1.01] hover:shadow-lg",
          className
        )}
        {...props}
      >
        {children}
      </Card>
    );

    if (animate && hover) {
      return (
        <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
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

export const CyberpunkCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    const { getTextColor } = useThemeConfig();
    return <CardDescription ref={ref} className={cn(getTextColor("secondary"), className)} {...props} />;
  }
);
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

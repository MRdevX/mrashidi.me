import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./Card";
import { cn } from "@/lib/utils";

interface CyberpunkCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "glass" | "feature" | "default";
  hover?: boolean;
  animate?: boolean;
}

const cyberpunkVariants = {
  glass: "glass-card",
  feature: "feature-card",
  default: "bg-gray-900/50 border border-gray-700 rounded-xl",
};

export const CyberpunkCard = React.forwardRef<HTMLDivElement, CyberpunkCardProps>(
  ({ children, className, variant = "default", hover = false, animate = true, ...props }, ref) => {
    const cardElement = (
      <Card
        ref={ref}
        className={cn(
          "transition-all duration-300",
          cyberpunkVariants[variant],
          hover && "hover:scale-[1.02] hover:shadow-lg",
          className
        )}
        {...props}
      >
        {children}
      </Card>
    );

    if (animate && hover) {
      return (
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          {cardElement}
        </motion.div>
      );
    }

    return cardElement;
  }
);

CyberpunkCard.displayName = "CyberpunkCard";

export const CyberpunkCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <CardHeader ref={ref} className={cn("border-b border-gray-700/50", className)} {...props} />
  )
);
CyberpunkCardHeader.displayName = "CyberpunkCardHeader";

export const CyberpunkCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <CardTitle ref={ref} className={cn("text-orange-500 font-cyberpunk glow-text", className)} {...props} />
  )
);
CyberpunkCardTitle.displayName = "CyberpunkCardTitle";

export const CyberpunkCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <CardDescription ref={ref} className={cn("text-gray-400", className)} {...props} />
);
CyberpunkCardDescription.displayName = "CyberpunkCardDescription";

export const CyberpunkCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <CardContent ref={ref} className={cn("text-gray-300", className)} {...props} />
);
CyberpunkCardContent.displayName = "CyberpunkCardContent";

export const CyberpunkCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <CardFooter ref={ref} className={cn("border-t border-gray-700/50", className)} {...props} />
  )
);
CyberpunkCardFooter.displayName = "CyberpunkCardFooter";

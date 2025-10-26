import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "default" | "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animate?: boolean;
}

export function Skeleton({ className, variant = "default", width, height, animate = true, ...props }: SkeletonProps) {
  const baseClasses = "bg-muted/50 rounded-md";

  const variantClasses = {
    default: "rounded-md",
    text: "rounded-sm",
    circular: "rounded-full",
    rectangular: "rounded-none",
  };

  const animationClasses = animate ? "animate-shimmer" : "";

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], animationClasses, className)}
      style={{
        width: width,
        height: height,
      }}
      {...props}
    />
  );
}

// Shimmer animation keyframes will be added to animations.css

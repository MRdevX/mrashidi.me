import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}

export function PageWrapper({ children, className, containerClassName }: PageWrapperProps) {
  return (
    <div className={cn("min-h-screen py-12", className)}>
      {/* Subtle blur effect overlay for body content - positioned to avoid header/footer */}
      <div className="fixed top-16 bottom-16 left-0 right-0 bg-gradient-to-b from-white/3 via-white/1 to-white/3 dark:from-black/3 dark:via-black/1 dark:to-black/3 backdrop-blur-[0.5px] pointer-events-none z-[1]" />

      {/* Main content container */}
      <div className={cn("max-w-4xl mx-auto px-4 relative z-10", containerClassName)}>{children}</div>
    </div>
  );
}

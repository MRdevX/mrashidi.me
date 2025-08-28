"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  children: ReactNode;
  className?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  onClick?: () => void;
}

export function FloatingActionButton({
  children,
  className,
  position = "bottom-right",
  onClick,
}: FloatingActionButtonProps) {
  const positionClasses = {
    "bottom-right": "fixed bottom-20 right-4",
    "bottom-left": "fixed bottom-20 left-4",
    "top-right": "fixed top-20 right-4",
    "top-left": "fixed top-20 left-4",
  };

  return (
    <div className={cn("z-50 sm:hidden", positionClasses[position])}>
      <div
        className={cn(
          "bg-white/80 backdrop-blur-lg rounded-full p-2 shadow-lg dark:bg-gray-900/80 transition-all duration-200 hover:scale-105",
          className
        )}
        onClick={onClick}
      >
        {children}
      </div>
    </div>
  );
}

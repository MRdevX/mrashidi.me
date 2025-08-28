"use client";

import { ReactNode } from "react";

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
  return (
    <div className={`floating-action-btn ${position} ${className || ""}`}>
      <div className="floating-action-btn-container" onClick={onClick}>
        {children}
      </div>
    </div>
  );
}

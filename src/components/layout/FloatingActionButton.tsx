"use client";

import type { ReactNode } from "react";

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
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <div className={`floating-action-btn ${position} ${className || ""}`}>
      <button className="floating-action-btn-container" onClick={onClick} onKeyDown={handleKeyDown} type="button">
        {children}
      </button>
    </div>
  );
}

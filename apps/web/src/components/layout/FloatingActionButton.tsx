"use client";

import type { ReactNode } from "react";

interface FloatingActionButtonProps {
  children: ReactNode;
  className?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  onClick?: () => void;
  asButton?: boolean;
}

export function FloatingActionButton({
  children,
  className,
  position = "bottom-right",
  onClick,
  asButton = true,
}: FloatingActionButtonProps) {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <div className={`floating-action-btn ${position} ${className || ""}`}>
      {asButton ? (
        <button className="floating-action-btn-container" onClick={onClick} onKeyDown={handleKeyDown} type="button">
          {children}
        </button>
      ) : (
        <div className="floating-action-btn-container">{children}</div>
      )}
    </div>
  );
}

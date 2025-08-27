"use client";

import * as React from "react";
import type { ButtonVariant } from "@/config/theme.config";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./Button";

interface CyberpunkButtonProps extends Omit<ButtonProps, "variant"> {
  variant?: ButtonVariant;
  animate?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const CyberpunkButton = React.forwardRef<HTMLButtonElement, CyberpunkButtonProps>(
  (
    {
      className,
      variant = "default",
      animate = true,
      loading: _loading,
      icon,
      iconPosition: _iconPosition,
      children,
      ...props
    },
    ref
  ) => {
    const { getButtonVariant } = useThemeConfig();

    const buttonClasses = cn(
      "transition-all duration-300",
      getButtonVariant(variant),
      animate && "hover:scale-105 active:scale-95",
      className
    );

    const { asChild: _asChild, ...buttonProps } = props;

    return (
      <Button ref={ref} variant="ghost" className={buttonClasses} {...buttonProps}>
        {icon && <span className="inline-flex items-center">{icon}</span>}
        {children}
      </Button>
    );
  }
);

CyberpunkButton.displayName = "CyberpunkButton";

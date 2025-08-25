"use client";

import * as React from "react";
import { Button, ButtonProps } from "./Button";
import { cn } from "@/lib/utils";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import type { ButtonVariant } from "@/config/theme.config";

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

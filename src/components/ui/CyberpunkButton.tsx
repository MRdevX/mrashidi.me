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
      animate = false,
      loading: _loading,
      icon,
      iconPosition = "left",
      children,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const { getButtonVariant } = useThemeConfig();

    const buttonClasses = cn(
      "transition-all duration-300 focus-ring",
      getButtonVariant(variant),
      animate && "hover:scale-105 active:scale-95 hover:-translate-y-0.5",
      className
    );

    const iconElement = icon ? <span className="inline-flex shrink-0 items-center">{icon}</span> : null;

    if (asChild) {
      const child = React.Children.only(children) as React.ReactElement<{
        children?: React.ReactNode;
      }>;

      const composed = React.cloneElement(
        child,
        undefined,
        <>
          {iconPosition === "left" && iconElement}
          {child.props.children}
          {iconPosition === "right" && iconElement}
        </>
      );

      return (
        <Button ref={ref} variant="ghost" className={buttonClasses} asChild {...props}>
          {composed}
        </Button>
      );
    }

    return (
      <Button ref={ref} variant="ghost" className={buttonClasses} {...props}>
        {iconPosition === "left" && iconElement}
        {children}
        {iconPosition === "right" && iconElement}
      </Button>
    );
  }
);

CyberpunkButton.displayName = "CyberpunkButton";

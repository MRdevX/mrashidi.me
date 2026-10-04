import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { type BadgeVariant, getVariant } from "@/config/theme.config";
import { cn } from "@/lib/utils";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  icon?: LucideIcon;
  className?: string;
};

/** Small label using the `badge` variants from theme.config. */
export function Badge({ children, variant = "neon", icon: Icon, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium leading-5",
        getVariant("badge", variant),
        className
      )}
    >
      {Icon ? <Icon className="size-3.5 shrink-0" aria-hidden /> : null}
      {children}
    </span>
  );
}

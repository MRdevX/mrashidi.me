import * as React from "react";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, type DialogFooter, type DialogHeader, DialogTitle } from "./dialog";

export const CyberpunkDialog = Dialog;

export const CyberpunkDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  React.ComponentPropsWithoutRef<typeof DialogContent>
>(({ className, children, ...props }, ref) => {
  const { variants } = useThemeConfig();

  return (
    <DialogContent ref={ref} className={cn(variants.dialog.content, className)} {...props}>
      <div className="relative">
        {/* Cyberpunk border effect */}
        <div className="absolute inset-0 rounded-lg bg-linear-to-r from-orange-500/20 via-transparent to-orange-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        {children}
      </div>
    </DialogContent>
  );
});
CyberpunkDialogContent.displayName = "CyberpunkDialogContent";

export const CyberpunkDialogHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DialogHeader>
>(({ className, ...props }, ref) => {
  const { variants } = useThemeConfig();

  return <div ref={ref} className={cn(variants.dialog.header, className)} {...props} />;
});
CyberpunkDialogHeader.displayName = "CyberpunkDialogHeader";

export const CyberpunkDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogTitle>,
  React.ComponentPropsWithoutRef<typeof DialogTitle>
>(({ className, ...props }, ref) => {
  const { variants } = useThemeConfig();

  return <DialogTitle ref={ref} className={cn(variants.dialog.title, className)} {...props} />;
});
CyberpunkDialogTitle.displayName = "CyberpunkDialogTitle";

export const CyberpunkDialogFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DialogFooter>
>(({ className, ...props }, ref) => {
  const { variants } = useThemeConfig();

  return <div ref={ref} className={cn(variants.dialog.footer, className)} {...props} />;
});
CyberpunkDialogFooter.displayName = "CyberpunkDialogFooter";

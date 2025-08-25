import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { cn } from "@/lib/utils";

export const CyberpunkDialog = Dialog;

export const CyberpunkDialogTrigger = DialogTrigger;

export const CyberpunkDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  React.ComponentPropsWithoutRef<typeof DialogContent>
>(({ className, children, ...props }, ref) => (
  <DialogContent
    ref={ref}
    className={cn(
      "bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border border-orange-500/30 shadow-2xl",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
      "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
      className
    )}
    {...props}
  >
    <div className="relative">
      {/* Cyberpunk border effect */}
      <div className="absolute inset-0 rounded-lg bg-linear-to-r from-orange-500/20 via-transparent to-orange-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      {children}
    </div>
  </DialogContent>
));
CyberpunkDialogContent.displayName = "CyberpunkDialogContent";

export const CyberpunkDialogHeader = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof DialogHeader>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("border-b border-orange-500/20 pb-4", className)} {...props} />
  )
);
CyberpunkDialogHeader.displayName = "CyberpunkDialogHeader";

export const CyberpunkDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogTitle>,
  React.ComponentPropsWithoutRef<typeof DialogTitle>
>(({ className, ...props }, ref) => (
  <DialogTitle ref={ref} className={cn("text-orange-500 font-cyberpunk glow-text text-xl", className)} {...props} />
));
CyberpunkDialogTitle.displayName = "CyberpunkDialogTitle";

export const CyberpunkDialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogDescription>,
  React.ComponentPropsWithoutRef<typeof DialogDescription>
>(({ className, ...props }, ref) => (
  <DialogDescription ref={ref} className={cn("text-gray-600 dark:text-gray-400 font-albert", className)} {...props} />
));
CyberpunkDialogDescription.displayName = "CyberpunkDialogDescription";

export const CyberpunkDialogFooter = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof DialogFooter>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("border-t border-orange-500/20 pt-4", className)} {...props} />
  )
);
CyberpunkDialogFooter.displayName = "CyberpunkDialogFooter";

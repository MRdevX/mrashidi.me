"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { styles } from "./styles";

const SIDE_CLASSES = {
  right: "project-drawer inset-y-0 right-0 w-full max-w-xl border-l",
  bottom: "project-sheet inset-x-0 bottom-0 max-h-[88dvh] rounded-t-2xl border-t",
} as const;

type SheetProps = {
  side: keyof typeof SIDE_CLASSES;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  children: ReactNode;
};

export function Sheet({ side, open, onOpenChange, trigger, children }: SheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger ? <Dialog.Trigger asChild>{trigger}</Dialog.Trigger> : null}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 dark:bg-black/75" />
        <Dialog.Content
          aria-describedby={undefined}
          className={cn(
            "fixed z-50 flex flex-col overflow-y-auto overscroll-contain border-gray-200 bg-white text-gray-900 shadow-2xl focus:outline-none dark:border-white/10 dark:bg-[#12151b] dark:text-gray-100",
            SIDE_CLASSES[side]
          )}
        >
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export const SheetTitle = Dialog.Title;
export const SheetClose = Dialog.Close;

export function SheetCloseIcon({ label }: { label: string }) {
  return (
    <Dialog.Close aria-label={label} className={cn(styles.iconButton, "size-11 shrink-0")}>
      <X className="size-5" aria-hidden />
    </Dialog.Close>
  );
}

import { cn } from "@/lib/utils";

/** Shared orange gradient rule used under resume headings and in cards */
export const resumeFilamentLineClassName =
  "h-px rounded-full bg-[linear-gradient(90deg,_rgb(249_115_22/0.55)_0%,_rgb(249_115_22/0.22)_52%,_transparent_100%)] shadow-[0_0_14px_rgb(249_115_22/0.14)] dark:bg-[linear-gradient(90deg,_rgb(251_146_60/0.48)_0%,_rgb(251_146_60/0.18)_52%,_transparent_100%)] dark:shadow-[0_0_14px_rgb(251_146_60/0.12)]";

/** Same filament as resume styling; peak at center and transparent at both edges — slightly richer than asymmetric for centered use */
export const resumeFilamentSymmetricLineClassName =
  "h-[2px] rounded-full bg-[linear-gradient(90deg,_transparent_0%,_rgb(249_115_22/0.4)_37%,_rgb(249_115_22/0.72)_50%,_rgb(249_115_22/0.4)_63%,_transparent_100%)] shadow-[0_0_18px_rgb(249_115_22/0.22)] dark:bg-[linear-gradient(90deg,_transparent_0%,_rgb(251_146_60/0.34)_37%,_rgb(251_146_60/0.62)_50%,_rgb(251_146_60/0.34)_63%,_transparent_100%)] dark:shadow-[0_0_18px_rgb(251_146_60/0.18)]";

const widthPresetClass = "block w-[min(15rem,58%)] min-w-[10rem] sm:w-[min(19rem,50%)]";

const symmetricWidthPresetClass = "block w-[min(19rem,88%)] min-w-[11rem] sm:w-[min(24rem,82%)]";

type ResumeFilamentDividerProps = {
  className?: string;
  lineClassName?: string;
  align?: "start" | "center";
  /** Transparent → orange → transparent (e.g. centered dividers). */
  symmetric?: boolean;
};

export function ResumeFilamentDivider({
  className,
  lineClassName,
  align = "start",
  symmetric = false,
}: ResumeFilamentDividerProps) {
  const widthClass = symmetric ? symmetricWidthPresetClass : widthPresetClass;
  const lineBase = symmetric ? resumeFilamentSymmetricLineClassName : resumeFilamentLineClassName;

  return (
    <div className={cn("flex", align === "center" ? "justify-center" : "justify-start", className)} aria-hidden>
      <span className={cn(lineBase, widthClass, lineClassName)} />
    </div>
  );
}

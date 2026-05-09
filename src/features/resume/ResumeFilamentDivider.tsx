import { cn } from "@/lib/utils";

/** Shared orange gradient rule used under resume headings and in cards */
export const resumeFilamentLineClassName =
  "h-px rounded-full bg-[linear-gradient(90deg,_rgb(249_115_22/0.55)_0%,_rgb(249_115_22/0.22)_52%,_transparent_100%)] shadow-[0_0_14px_rgb(249_115_22/0.14)] dark:bg-[linear-gradient(90deg,_rgb(251_146_60/0.48)_0%,_rgb(251_146_60/0.18)_52%,_transparent_100%)] dark:shadow-[0_0_14px_rgb(251_146_60/0.12)]";

const widthPresetClass = "block w-[min(15rem,58%)] min-w-[10rem] sm:w-[min(19rem,50%)]";

type ResumeFilamentDividerProps = {
  className?: string;
  lineClassName?: string;
  align?: "start" | "center";
};

export function ResumeFilamentDivider({ className, lineClassName, align = "start" }: ResumeFilamentDividerProps) {
  return (
    <div className={cn("flex", align === "center" ? "justify-center" : "justify-start", className)} aria-hidden>
      <span className={cn(resumeFilamentLineClassName, widthPresetClass, lineClassName)} />
    </div>
  );
}

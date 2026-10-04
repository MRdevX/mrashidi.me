import { cn } from "@/lib/utils";

const widthPresetClass = "w-[min(15rem,58%)] min-w-[10rem] sm:w-[min(19rem,50%)]";

const symmetricWidthPresetClass = "w-[min(19rem,88%)] min-w-[11rem] sm:w-[min(24rem,82%)]";

type FilamentDividerProps = {
  className?: string;
  lineClassName?: string;
  align?: "start" | "center";
  /** Transparent → brand orange → transparent (e.g. centered dividers). */
  symmetric?: boolean;
};

/** Brand-orange gradient rule; styles live in `.filament-line*` (components.css). */
export function FilamentDivider({
  className,
  lineClassName,
  align = "start",
  symmetric = false,
}: FilamentDividerProps) {
  return (
    <div className={cn("flex", align === "center" ? "justify-center" : "justify-start", className)} aria-hidden>
      <span
        className={cn(
          "filament-line",
          symmetric ? ["filament-line--symmetric", symmetricWidthPresetClass] : widthPresetClass,
          lineClassName
        )}
      />
    </div>
  );
}

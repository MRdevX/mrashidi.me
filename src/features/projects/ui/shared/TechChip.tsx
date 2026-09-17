import { getTechIcon } from "@/lib/tech";
import { cn } from "@/lib/utils";
import { pluralizeProjects } from "./labels";
import { styles } from "./styles";

const SIZE_CLASSES = {
  lg: "h-10 rounded-lg px-3 text-sm",
  md: "h-9 rounded-lg px-2.5 text-[13px]",
  sm: "h-7 rounded-md px-2 font-terminal text-xs",
} as const;

type TechChipProps = {
  tech: string;
  selected: boolean;
  onToggle: (tech: string) => void;
  size?: keyof typeof SIZE_CLASSES;
  count?: number;
  disabled?: boolean;
};

export function TechChip({ tech, selected, onToggle, size = "lg", count, disabled = false }: TechChipProps) {
  const techIcon = size === "sm" ? null : getTechIcon(tech);

  return (
    <button
      type="button"
      onClick={() => onToggle(tech)}
      aria-pressed={selected}
      disabled={disabled}
      className={cn(
        styles.chip,
        styles.focusRing,
        SIZE_CLASSES[size],
        selected ? styles.chipOn : disabled ? styles.chipDisabled : styles.chipOff
      )}
    >
      {techIcon ? (
        <techIcon.Icon className={cn("size-3.5 shrink-0", disabled ? "opacity-50" : techIcon.colorClass)} aria-hidden />
      ) : null}
      <span>{tech}</span>
      {count !== undefined ? (
        <span
          className={cn(
            "font-terminal text-xs",
            selected ? "text-orange-800 dark:text-orange-300" : styles.textSecondary
          )}
        >
          <span className="sr-only">, </span>
          {count}
          <span className="sr-only"> {pluralizeProjects(count)}</span>
        </span>
      ) : null}
    </button>
  );
}

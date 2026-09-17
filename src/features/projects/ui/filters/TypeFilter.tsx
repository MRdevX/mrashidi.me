import { cn } from "@/lib/utils";
import { useProjectCatalog } from "../../application/ProjectCatalogContext";
import { PROJECT_TYPE_FILTERS } from "../../domain/filters";
import { TYPE_LABELS } from "../shared/labels";
import { styles } from "../shared/styles";

const VARIANTS = {
  segmented: {
    group: cn(styles.field, "h-12 shrink-0 gap-0.5 p-1"),
    button: "h-full rounded-md px-3 font-medium",
    on: "bg-gray-900 text-white dark:bg-white/15 dark:text-gray-50",
    off: "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50",
  },
  pills: {
    group: "contents",
    button: "h-11 shrink-0 rounded-full border px-4",
    on: styles.chipOn,
    off: styles.chipOff,
  },
} as const;

export function TypeFilter({ variant }: { variant: keyof typeof VARIANTS }) {
  const { filters, typeCounts, setType } = useProjectCatalog();
  const classes = VARIANTS[variant];

  return (
    <fieldset className={cn("flex items-center", classes.group)}>
      <legend className="sr-only">Project type</legend>
      {PROJECT_TYPE_FILTERS.map((type) => {
        const selected = filters.type === type;
        return (
          <button
            key={type}
            type="button"
            aria-pressed={selected}
            onClick={() => setType(type)}
            className={cn(
              "flex items-center gap-2 font-albert text-sm transition-colors",
              styles.focusRing,
              classes.button,
              selected ? classes.on : classes.off
            )}
          >
            {TYPE_LABELS[type]}
            <span className="font-terminal text-xs opacity-80">{typeCounts[type]}</span>
          </button>
        );
      })}
    </fieldset>
  );
}

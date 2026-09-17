import { cn } from "@/lib/utils";
import { useProjectCatalog } from "../../application/ProjectCatalogContext";
import { styles } from "../shared/styles";

export function OpenSourceSwitch() {
  const { filters, setOpenSourceOnly } = useProjectCatalog();
  const checked = filters.openSourceOnly;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => setOpenSourceOnly(!checked)}
      className={cn(
        styles.field,
        styles.focusRing,
        "flex h-12 shrink-0 items-center gap-2.5 px-3.5 font-albert text-sm text-gray-800 dark:text-gray-200"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "relative inline-block h-5 w-9 rounded-full transition-colors",
          checked ? "bg-orange-600 dark:bg-orange-500" : "bg-gray-300 dark:bg-white/15"
        )}
      >
        <span
          className={cn(
            "absolute top-[3px] size-3.5 rounded-full bg-white shadow transition-[left] motion-reduce:transition-none",
            checked ? "left-[19px]" : "left-[3px]"
          )}
        />
      </span>
      Open source only
    </button>
  );
}

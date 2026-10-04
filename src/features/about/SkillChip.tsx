import { cva, type VariantProps } from "class-variance-authority";
import { getTechIcon } from "@/lib/tech";
import { cn } from "@/lib/utils";
import { SKILL_TIER_META, type SkillTier } from "./aboutSkillsGrouped";

/** Colours live in `.a11y-tech-chip*` (components.css) so they stay opaque for contrast checks. */
const skillChipVariants = cva(
  "a11y-tech-chip relative isolate inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-border transition-[color,background-color,border-color,box-shadow] duration-200",
  {
    variants: {
      tier: {
        core: "a11y-tech-chip--core font-semibold",
        experienced: "font-medium",
        familiar: "a11y-tech-chip--familiar border-dashed font-medium",
      },
      size: {
        md: "px-3 py-1.5 text-sm",
        lg: "px-3.5 py-2 text-[15px]",
      },
    },
    defaultVariants: { size: "md" },
  }
);

type SkillChipProps = { name: string; tier: SkillTier } & Pick<VariantProps<typeof skillChipVariants>, "size">;

export function SkillChip({ name, tier, size }: SkillChipProps) {
  const { Icon, colorClass } = getTechIcon(name);
  const tierLabel = SKILL_TIER_META[tier].label;

  return (
    <li className={skillChipVariants({ tier, size })} title={`${name} (${tierLabel})`}>
      <Icon className={cn("size-4 shrink-0", colorClass, tier === "familiar" && "opacity-60 grayscale")} aria-hidden />
      <span>
        {name}
        <span className="sr-only">, {tierLabel.toLowerCase()}</span>
      </span>
    </li>
  );
}

/** Small sample used in the proficiency key. */
export function SkillTierSwatch({ tier }: { tier: SkillTier }) {
  return (
    <span aria-hidden className={cn(skillChipVariants({ tier }), "px-2 py-0.5 text-xs")}>
      Aa
    </span>
  );
}

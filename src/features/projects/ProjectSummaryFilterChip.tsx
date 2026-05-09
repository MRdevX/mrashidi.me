import type { LucideIcon } from "lucide-react";
import { Filter, Globe, Search } from "lucide-react";

type ChipVariant = "search" | "stack" | "openSource";

const chipTone: Record<
  ChipVariant,
  {
    Icon: LucideIcon;
    className: string;
  }
> = {
  search: {
    Icon: Search,
    className: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  },
  stack: {
    Icon: Filter,
    className: "bg-green-500/20 text-green-400 border border-green-500/30",
  },
  openSource: {
    Icon: Globe,
    className: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  },
};

type ProjectSummaryFilterChipProps =
  | { kind: "search"; label: string }
  | { kind: "stack"; label: string }
  | { kind: "openSource" };

export function ProjectSummaryFilterChip(props: ProjectSummaryFilterChipProps) {
  const { Icon, className } = chipTone[props.kind];
  const label =
    props.kind === "openSource" ? "Open Source" : props.kind === "search" ? `Search: ${props.label}` : props.label;

  return (
    <span className={`px-2 py-1 ${className} text-xs rounded flex items-center gap-1`}>
      <Icon className="size-3 shrink-0" aria-hidden />
      {label}
    </span>
  );
}

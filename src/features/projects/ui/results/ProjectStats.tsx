import { cn } from "@/lib/utils";
import { useProjectCatalog } from "../../application/ProjectCatalogContext";
import { styles } from "../shared/styles";

export function ProjectStats() {
  const { overview } = useProjectCatalog();
  const stats = [
    { label: "Projects", value: overview.projectCount },
    { label: "Open source", value: overview.openSourceCount },
    { label: "Technologies", value: overview.stackCount },
  ];

  return (
    <dl className="flex gap-6 md:gap-8">
      {stats.map(({ label, value }) => (
        <div key={label} className="flex flex-col-reverse gap-1">
          <dt className={cn(styles.label, "text-[11px]")}>{label}</dt>
          <dd className={cn("font-terminal text-2xl font-semibold", styles.textPrimary)}>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

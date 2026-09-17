import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useProjectCatalog } from "../../application/ProjectCatalogContext";
import type { StackFacet } from "../../domain/stack";
import { TechChip } from "../shared/TechChip";

type StackFacetListProps = {
  facets: StackFacet[];
  size: "lg" | "md";
  className?: string;
  children?: ReactNode;
};

export function StackFacetList({ facets, size, className, children }: StackFacetListProps) {
  const { toggleStack } = useProjectCatalog();

  return (
    <ul className={cn("flex flex-wrap", className)}>
      {facets.map((facet) => (
        <li key={facet.tech}>
          <TechChip {...facet} size={size} onToggle={toggleStack} />
        </li>
      ))}
      {children ? <li>{children}</li> : null}
    </ul>
  );
}

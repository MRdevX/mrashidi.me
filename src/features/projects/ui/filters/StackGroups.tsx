import { useProjectCatalog } from "../../application/ProjectCatalogContext";
import { styles } from "../shared/styles";
import { StackFacetList } from "./StackFacetList";

export function StackGroups({ size }: { size: "lg" | "md" }) {
  const { groupFacets } = useProjectCatalog();

  return groupFacets.map((group) => (
    <section key={group.name} className="flex flex-col gap-2.5">
      <h3 className={styles.label}>{group.name}</h3>
      <StackFacetList facets={group.items} size={size} className={size === "lg" ? "gap-2" : "gap-1.5"} />
    </section>
  ));
}

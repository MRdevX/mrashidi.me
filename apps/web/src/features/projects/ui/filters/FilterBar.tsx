import { cn } from "@/lib/utils";
import { styles } from "../shared/styles";
import { MobileFilterSheet } from "./MobileFilterSheet";
import { OpenSourceSwitch } from "./OpenSourceSwitch";
import { SearchField } from "./SearchField";
import { SortSelect } from "./SortSelect";
import { StackFilter } from "./StackFilter";
import { TypeFilter } from "./TypeFilter";

export function FilterBar() {
  return (
    <section aria-label="Filter projects" className={cn(styles.panel, "flex flex-col gap-4 p-4 md:p-5")}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchField />
        <div className="hidden flex-wrap items-center gap-3 md:flex">
          <TypeFilter variant="segmented" />
          <OpenSourceSwitch />
          <SortSelect />
        </div>
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-0.5 [scrollbar-width:none] md:hidden">
        <MobileFilterSheet />
        <TypeFilter variant="pills" />
      </div>

      <div className="hidden md:block">
        <StackFilter />
      </div>
    </section>
  );
}

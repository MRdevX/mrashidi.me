import type { TechStackItem } from "@/lib/tech";
import { getTechIcon } from "@/lib/tech";
import { cn } from "@/lib/utils";

interface TechStackGridProps {
  techStack: TechStackItem[];
}

export function TechStackGrid({ techStack }: TechStackGridProps) {
  return (
    <div className="content-section flex flex-col items-center">
      <div className="flex flex-wrap justify-center gap-6">
        {techStack.map((tech) => {
          const { Icon, colorClass } = getTechIcon(tech.iconKey);
          return (
            <div
              key={tech.name}
              className="group flex flex-col items-center gap-2 p-3 rounded-lg bg-white/30 dark:bg-black/30 border border-primary/10 shadow hover:shadow-primary/20 motion-safe:hover:-translate-y-0.5 transition-[transform,box-shadow] duration-300 ease-out min-w-[90px]"
            >
              <Icon
                className={cn(
                  "w-10 h-10 opacity-70 grayscale transition-[filter,opacity] duration-300 group-hover:opacity-100 group-hover:grayscale-0",
                  colorClass
                )}
                aria-hidden
              />
              <span className="text-xs text-body font-mono text-center mt-1">{tech.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

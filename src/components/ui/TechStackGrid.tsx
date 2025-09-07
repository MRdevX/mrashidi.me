import type { TechStackItem } from "@/lib/tech";
import { getTechIcon } from "@/lib/tech";

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
              className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/30 dark:bg-black/30 border border-orange-500/10 shadow hover:shadow-orange-500/20 transition-all min-w-[90px]"
            >
              <Icon className={`w-10 h-10 ${colorClass}`} />
              <span className="text-xs text-body font-mono text-center mt-1">{tech.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

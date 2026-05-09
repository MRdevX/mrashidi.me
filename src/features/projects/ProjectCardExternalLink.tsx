import type { ReactNode } from "react";
import { NewTabSrOnly } from "@/lib/a11y/new-tab-hint";
import { cn } from "@/lib/utils";

const variantClass = {
  github:
    "border-orange-700/30 bg-orange-50 text-orange-950 hover:bg-orange-100 dark:border-orange-400/45 dark:bg-orange-950 dark:text-orange-50 dark:hover:bg-orange-900",
  live: "border-green-800/30 bg-green-50 text-green-950 hover:bg-green-100 dark:border-green-400/45 dark:bg-green-950 dark:text-green-50 dark:hover:bg-green-900",
  caseStudy:
    "border-blue-800/30 bg-blue-50 text-blue-950 hover:bg-blue-100 dark:border-blue-400/45 dark:bg-blue-950 dark:text-blue-50 dark:hover:bg-blue-900",
} as const satisfies Record<string, string>;

export type ProjectCardExternalLinkVariant = keyof typeof variantClass;

type ProjectCardExternalLinkProps = {
  href: string;
  variant: ProjectCardExternalLinkVariant;
  /** Omit for text-only links (e.g. case study). */
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function ProjectCardExternalLink({ href, variant, icon, children, className }: ProjectCardExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-1 rounded border px-3 py-1 text-xs font-semibold transition-colors",
        variantClass[variant],
        className
      )}
    >
      {icon}
      {children}
      <NewTabSrOnly />
    </a>
  );
}

import type { ReactNode } from "react";
import { NewTabSrOnly } from "@/lib/a11y/new-tab-hint";

export const TerminalSection = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="mt-2 space-y-2">
    <p className="text-brand-text font-bold">{title}</p>
    {children}
  </div>
);

export const TerminalLink = ({
  href,
  children,
  className = "text-terminal hover:underline",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
    {children}
    <NewTabSrOnly />
  </a>
);

export const TerminalListItem = ({
  children,
  className = "text-gray-600 dark:text-gray-400",
}: {
  children: ReactNode;
  className?: string;
}) => <li className={className}>• {children}</li>;

const BADGE_VARIANTS = {
  public: "bg-emerald-700 text-white",
  private: "bg-gray-700 text-gray-300",
  personal: "bg-blue-700 text-white",
  professional: "bg-orange-700 text-white",
  default: "bg-gray-700 text-gray-300",
} as const;

export const TerminalBadge = ({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: keyof typeof BADGE_VARIANTS;
}) => {
  return <span className={`px-2 py-0.5 rounded font-semibold text-xs ${BADGE_VARIANTS[variant]}`}>{children}</span>;
};

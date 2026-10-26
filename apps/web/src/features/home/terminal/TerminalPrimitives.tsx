import type { ReactNode } from "react";
import { NewTabSrOnly } from "@/lib/a11y/new-tab-hint";

export const TerminalSection = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="mt-2 space-y-2">
    <p className="text-orange-500 font-bold">{title}</p>
    {children}
  </div>
);

export const TerminalLink = ({
  href,
  children,
  className = "text-green-400 hover:underline",
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
  className = "text-gray-400",
}: {
  children: ReactNode;
  className?: string;
}) => <li className={className}>• {children}</li>;

const BADGE_VARIANTS = {
  public: "bg-[#10b981] text-white",
  private: "bg-gray-700 text-gray-300",
  personal: "bg-[#3b82f6] text-white",
  professional: "bg-[#ff5f1f] text-white",
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

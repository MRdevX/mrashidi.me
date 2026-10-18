import type { ReactNode } from "react";
import { getThemeConfig } from "@/config/theme.config";
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

export const TerminalBadge = ({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "public" | "private" | "personal" | "professional" | "default";
}) => {
  const { colors } = getThemeConfig();

  const variants = {
    public: `bg-[${colors.success.DEFAULT}] text-white`,
    private: "bg-gray-700 text-gray-300",
    personal: `bg-[${colors.info.DEFAULT}] text-white`,
    professional: `bg-[${colors.primary.DEFAULT}] text-white`,
    default: "bg-gray-700 text-gray-300",
  };

  return <span className={`px-2 py-0.5 rounded font-semibold text-xs ${variants[variant]}`}>{children}</span>;
};

import { LucideIcon } from "lucide-react";
import { useThemeConfig } from "@/hooks/useThemeConfig";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function SectionHeader({ icon: Icon, title, className = "", size = "md" }: SectionHeaderProps) {
  const { getSectionTitle } = useThemeConfig();

  const sizeClasses = {
    sm: "text-xl font-bold",
    md: "text-2xl font-bold",
    lg: "text-3xl font-bold",
  };

  return (
    <div className={`section-header section-header-${size} ${className}`}>
      <Icon className="section-header-icon" />
      <h2 className={`${sizeClasses[size]} ${getSectionTitle()}`}>{title}</h2>
    </div>
  );
}

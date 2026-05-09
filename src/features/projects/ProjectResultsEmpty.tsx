"use client";

import { AlertCircle } from "lucide-react";
import { useThemeConfig } from "@/hooks/useThemeConfig";

export function ProjectResultsEmpty() {
  const { getTextColor } = useThemeConfig();

  return (
    <div className="py-12 text-center">
      <div className={`mb-2 flex items-center justify-center gap-2 text-lg ${getTextColor("muted")}`}>
        <AlertCircle className="size-5 shrink-0" />
        No projects found
      </div>
      <p className={`text-sm ${getTextColor("secondary")}`}>
        Try adjusting your search or filters to see more projects
      </p>
    </div>
  );
}

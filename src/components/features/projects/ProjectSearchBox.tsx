import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { CyberpunkButton } from "@/components/ui";
import { useThemeConfig } from "@/hooks/useThemeConfig";

interface ProjectSearchBoxProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClear: () => void;
}

export function ProjectSearchBox({ searchQuery, onSearchChange, onClear }: ProjectSearchBoxProps) {
  const { getTextColor, getBackgroundColor } = useThemeConfig();

  return (
    <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-orange-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search projects by title, description, technology, or use regex patterns..."
          className={`w-full pl-12 pr-12 py-4 ${getBackgroundColor("glassLight")} border-2 border-orange-500/30 rounded-lg ${getTextColor("primary")} placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:${getBackgroundColor("glass")} transition-all duration-300 font-albert`}
        />
        {searchQuery && (
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
            <CyberpunkButton
              onClick={onClear}
              variant="ghost"
              icon={<X className="h-4 w-4" />}
              className={`h-8 w-8 p-0 ${getTextColor("secondary")} hover:text-orange-400`}
            />
          </div>
        )}
      </div>
      {searchQuery && (
        <div className={`mt-3 text-sm ${getTextColor("secondary")} font-albert`}>
          <p className="flex items-center gap-2">
            <span className="text-orange-400 font-albert">Searching for:</span>
            <span
              className={`text-orange-300 font-mono ${getBackgroundColor("glass")} px-2 py-1 rounded border border-orange-500/30`}
            >
              {searchQuery}
            </span>
          </p>
          <p className={`text-xs mt-2 ${getTextColor("muted")}`}>
            Supports regex patterns. Examples: &quot;microservice&quot;, &quot;docker|kubernetes&quot;, &quot;202[45]&quot;,
            &quot;auth.*service&quot;
          </p>
        </div>
      )}
    </motion.div>
  );
}

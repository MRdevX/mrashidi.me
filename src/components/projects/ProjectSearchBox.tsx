import { motion } from "framer-motion";
import { Search, X } from "lucide-react";

interface ProjectSearchBoxProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClear: () => void;
}

export default function ProjectSearchBox({ searchQuery, onSearchChange, onClear }: ProjectSearchBoxProps) {
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
          className="w-full pl-12 pr-12 py-4 bg-gray-800/30 border-2 border-orange-500/30 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:bg-gray-800/50 transition-all duration-300 font-albert"
        />
        {searchQuery && (
          <button
            onClick={onClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-orange-400 transition-colors duration-200 hover:scale-110"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      {searchQuery && (
        <div className="mt-3 text-sm text-gray-400 font-albert">
          <p className="flex items-center gap-2">
            <span className="text-orange-400 font-albert">Searching for:</span>
            <span className="text-orange-300 font-mono bg-gray-800/50 px-2 py-1 rounded border border-orange-500/30">
              {searchQuery}
            </span>
          </p>
          <p className="text-xs mt-2 text-gray-500">
            Supports regex patterns. Examples: &quot;microservice&quot;, &quot;docker|kubernetes&quot;, &quot;202[45]&quot;,
            &quot;auth.*service&quot;
          </p>
        </div>
      )}
    </motion.div>
  );
}

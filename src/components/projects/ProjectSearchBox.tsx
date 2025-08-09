import { motion } from "framer-motion";

interface ProjectSearchBoxProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClear: () => void;
}

export default function ProjectSearchBox({ searchQuery, onSearchChange, onClear }: ProjectSearchBoxProps) {
  return (
    <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search projects by title, description, technology, or use regex patterns..."
          className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-orange-500/20 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={onClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      {searchQuery && (
        <div className="mt-2 text-sm text-gray-400">
          <p>
            Searching for: <span className="text-orange-400 font-mono">{searchQuery}</span>
          </p>
          <p className="text-xs mt-1">
            Supports regex patterns. Examples: &quot;microservice&quot;, &quot;docker|kubernetes&quot;, &quot;202[45]&quot;,
            &quot;auth.*service&quot;
          </p>
        </div>
      )}
    </motion.div>
  );
}

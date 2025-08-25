import { CyberpunkButton } from "@/components/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useThemeConfig } from "@/hooks/useThemeConfig";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function BlogPagination({ currentPage, totalPages, onPageChange }: BlogPaginationProps) {
  const { getTextColor } = useThemeConfig();

  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 flex justify-center items-center space-x-4">
      <CyberpunkButton
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        variant="neon"
        icon={<ChevronLeft className="w-4 h-4" />}
        className={currentPage === 1 ? "opacity-50" : ""}
      >
        Previous
      </CyberpunkButton>
      <span className={`px-4 py-2 ${getTextColor("secondary")} font-albert`}>
        Page {currentPage} of {totalPages}
      </span>
      <CyberpunkButton
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        variant="neon"
        icon={<ChevronRight className="w-4 h-4" />}
        iconPosition="right"
        className={currentPage === totalPages ? "opacity-50" : ""}
      >
        Next
      </CyberpunkButton>
    </div>
  );
}

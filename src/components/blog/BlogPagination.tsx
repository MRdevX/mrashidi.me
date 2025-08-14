interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function BlogPagination({ currentPage, totalPages, onPageChange }: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 flex justify-center space-x-4">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`neon-button ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        Previous
      </button>
      <span className="px-4 py-2 text-gray-400">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`neon-button ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        Next
      </button>
    </div>
  );
}

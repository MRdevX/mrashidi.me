import { Pagination } from "@/components/ui";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function BlogPagination({ currentPage, totalPages, onPageChange }: BlogPaginationProps) {
  return <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />;
}

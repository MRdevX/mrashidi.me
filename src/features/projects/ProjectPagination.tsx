import { Pagination } from "@/components/ui";

interface ProjectPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ProjectPagination({ currentPage, totalPages, onPageChange }: ProjectPaginationProps) {
  return <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />;
}

import { memo, useMemo } from "react";
import { usePagination } from "@/hooks/usePagination";

interface PaginationButtonProps {
  totalPages: number;
}

const PaginationButton = memo<PaginationButtonProps>(({ totalPages }) => {
  const { currentPage, prevPage, nextPage, goToPage } = usePagination();

  const pageButtons = useMemo(() => {
    const pageGroup = 10;
    const currentGroup = Math.floor(currentPage / pageGroup);
    const startPage = currentGroup * pageGroup;
    const endPage = Math.min(startPage + pageGroup, totalPages);

    return Array.from({ length: endPage - startPage }, (_, index) => {
      const pageIndex = index + currentGroup * pageGroup;
      return (
        <button
          key={pageIndex}
          className={`${currentPage === pageIndex ? "font-medium bg-gray-200" : ""} cursor-pointer flex w-[30px] h-[30px] rounded-md items-center justify-center`}
          onClick={() => goToPage(pageIndex)}
          aria-label={`${pageIndex + 1}페이지로 이동`}
          aria-current={currentPage === pageIndex ? "page" : undefined}
        >
          {pageIndex + 1}
        </button>
      );
    });
  }, [currentPage, totalPages, goToPage]);

  return (
    <div className="flex" role="navigation" aria-label="페이지네이션">
      <button
        className="flex w-[30px] h-[30px] text-gray-500 cursor-pointer disabled:text-gray-300 items-center justify-center"
        disabled={currentPage === 0}
        onClick={prevPage}
        aria-label="이전 페이지"
      >
        <span className="icon-[lucide--chevron-left] w-3.5 h-3.5"></span>
      </button>
      {pageButtons}
      <button
        className="flex w-[30px] h-[30px] text-gray-500 disabled:text-gray-300 items-center justify-center cursor-pointer"
        disabled={currentPage + 1 >= totalPages}
        onClick={nextPage}
        aria-label="다음 페이지"
      >
        <span className="icon-[lucide--chevron-right] w-3.5 h-3.5"></span>
      </button>
    </div>
  );
});

PaginationButton.displayName = "PaginationButton";

export default PaginationButton;

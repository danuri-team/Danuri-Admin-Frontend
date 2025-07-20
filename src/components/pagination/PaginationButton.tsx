import type { Table } from "@tanstack/react-table";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import type { UsageData } from "../CustomTable";

const PaginationButton = ({ table }: { table: Table<UsageData> }) => {
  return (
    <div className="flex">
      <button
        className="flex w-[30px] h-[30px] text-gray-500 disabled:text-gray-300 items-center justify-center"
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.previousPage()}
      >
        <IoIosArrowBack size={14} />
      </button>
      {(() => {
        const totalPageIndex = table.getPageCount();
        const currentPageIndex = table.getState().pagination.pageIndex;
        const pageGroup = 10;

        const currentGroup = Math.floor(currentPageIndex / pageGroup);
        const startPage = currentGroup * pageGroup;
        const endPage = Math.min(startPage + pageGroup, totalPageIndex);

        return Array.from({ length: endPage - startPage }).map((_, index) => {
          const pageIndex = index + currentGroup * pageGroup;
          return (
            <button
              className={`${currentPageIndex === pageIndex ? "font-medium bg-gray-200" : ""} flex w-[30px] h-[30px] rounded-md items-center justify-center `}
              key={pageIndex}
              onClick={() => table.setPageIndex(pageIndex)}
            >
              {pageIndex + 1}
            </button>
          );
        });
      })()}
      <button
        className="flex w-[30px] h-[30px] text-gray-500 disabled:text-gray-300 items-center justify-center"
        disabled={!table.getCanNextPage()}
        onClick={() => table.nextPage()}
      >
        <IoIosArrowForward size={14} />
      </button>
    </div>
  );
};

export default PaginationButton;

import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { useSearchParams } from "react-router-dom";

const PaginationButton = ({ totalPages }: { totalPages: number }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <div className="flex">
      <button
        className="flex w-[30px] h-[30px] text-gray-500 cursor-pointer disabled:text-gray-300 items-center justify-center"
        disabled={(Number(searchParams.get("page")) || 0) - 1 < 0}
        onClick={() => {
          const current = Number(searchParams.get("page")) || 0;
          searchParams.set("page", String(current - 1));
          setSearchParams(searchParams);
        }}
      >
        <IoIosArrowBack size={14} />
      </button>
      {(() => {
        const totalPageIndex = totalPages;
        const currentPageIndex = Number(searchParams.get("page")) || 0;
        const pageGroup = 10;

        const currentGroup = Math.floor(currentPageIndex / pageGroup);
        const startPage = currentGroup * pageGroup;
        const endPage = Math.min(startPage + pageGroup, totalPageIndex);

        return Array.from({ length: endPage - startPage }).map((_, index) => {
          const pageIndex = index + currentGroup * pageGroup;
          return (
            <button
              className={`${currentPageIndex === pageIndex ? "font-medium bg-gray-200" : ""} cursor-pointer flex w-[30px] h-[30px] rounded-md items-center justify-center `}
              key={pageIndex}
              onClick={() => {
                searchParams.set("page", String(pageIndex));
                setSearchParams(searchParams);
              }}
            >
              {pageIndex + 1}
            </button>
          );
        });
      })()}
      <button
        className="flex w-[30px] h-[30px] text-gray-500 disabled:text-gray-300 items-center justify-center cursor-pointer"
        disabled={(Number(searchParams.get("page")) || 0) + 1 >= totalPages}
        onClick={() => {
          const current = Number(searchParams.get("page")) || 0;
          searchParams.set("page", String(current + 1));
          setSearchParams(searchParams);
        }}
      >
        <IoIosArrowForward size={14} />
      </button>
    </div>
  );
};

export default PaginationButton;

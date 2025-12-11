import { memo, useState } from "react";
import { usePagination } from "@/hooks/usePagination";

const pageSizeOptions = [10, 50, 100] as const;

const PageSizeSelector = memo(() => {
  const { pageSize, setSize } = usePagination();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="text-sm">
      <div className="flex items-center gap-[5px]">
        <button
          type="button"
          className="flex items-center gap-[5px] border-1 border-gray-200 rounded-md p-[3px] w-[50px] cursor-pointer justify-between pl-[10px]"
          onClick={() => setIsOpen(!isOpen)}
          onBlur={() => setIsOpen(false)}
          aria-label="페이지 크기 선택"
          aria-expanded={isOpen}
        >
          {pageSize}
          <span className="icon-[lucide--chevron-down] w-2.5 h-2.5"></span>
        </button>
        <span className="text-gray-500 text-xs">씩 보기</span>
      </div>
      {isOpen && (
        <ul
          className="absolute mt-[5px] bg-white w-[50px] border-gray-200 border-1 rounded-md p-[3px] z-10"
          role="listbox"
        >
          {pageSizeOptions.map((option) => (
            <li
              className="cursor-pointer hover:bg-gray-200 rounded-sm p-[2px]"
              key={option}
              role="option"
              aria-selected={pageSize === option}
              onMouseDown={() => {
                setSize(option);
                setIsOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

PageSizeSelector.displayName = "PageSizeSelector";

export default PageSizeSelector;

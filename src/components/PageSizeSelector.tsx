import type { Table } from "@tanstack/react-table";
import { useState } from "react";
import type { UsageData } from "./CustomTable";
import { IoCaretDownOutline } from "react-icons/io5";

const pageSizeOptions = [{ value: 10 }, { value: 50 }, { value: 100 }];

const PageSizeSelector = ({ table }: { table: Table<UsageData> }) => {
  const [isopenPageSize, setIsOpenPageSize] = useState<boolean>(false);

  return (
    <div className="text-sm">
      <div className="flex items-center gap-[5px]">
        <button
          className="flex items-center gap-[5px] border-1 border-gray-200 rounded-md p-[3px] w-[50px] cursor-pointer justify-between pl-[10px]"
          onClick={() => setIsOpenPageSize(!isopenPageSize)}
          onBlur={()=> setIsOpenPageSize(false)}
        >
          {table.getState().pagination.pageSize}
          <IoCaretDownOutline size={10} />
        </button>
        <span className="text-gray-500 text-xs">씩 보기</span>
      </div>
      {isopenPageSize && (
        <ul className="absolute mt-[5px] bg-white w-[50px] border-gray-200 border-1 rounded-md p-[3px]">
          {pageSizeOptions.map((option) => (
            <li className="cursor-pointer hover:bg-gray-200 rounded-sm p-[2px]" key={option.value} onMouseDown={() => table.setPageSize(option.value)}>
              {option.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PageSizeSelector;

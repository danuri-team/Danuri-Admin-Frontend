import type { Table } from "@tanstack/react-table";
import type { UsageData } from "../CustomTable";
import { useEffect, useState } from "react";

const PageJump = ({ table }: { table: Table<UsageData> }) => {
  const [currentPage, setCurrentPage] = useState<string>(
    (table.getState().pagination.pageIndex + 1).toString()
  );

  useEffect(() => {
    //pagination 에서 페이지 변경 됐을 때 감지
    setCurrentPage((table.getState().pagination.pageIndex + 1).toString());
  }, [table]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = e.target.value;
    setCurrentPage(page);
  };

  const handleBlur = () => {
    //input 포커스에서 벗어났을 때 페이지 적용
    const index = Number(currentPage) - 1;
    if (!isNaN(index) && index >= 0 && index < table.getPageCount()) {
      //실제 페이지 인덱스 업데이트
      table.setPageIndex(index);
    } else {
      //페이지 인덱스 그대로 유지
      setCurrentPage((table.getState().pagination.pageIndex + 1).toString());
    }
  };

  return (
    <div className="text-sm flex items-center gap-[5px]">
      <span className="text-gray-500 text-xs">페이지 이동</span>
      <input
        className="text-center border-1 border-gray-200 rounded-md p-[3px] pl-[10px] w-[50px] "
        type="number"
        value={currentPage}
        min={1}
        max={table.getPageCount()}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default PageJump;

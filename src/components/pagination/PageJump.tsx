import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const PageJump = ({ totalPages }: { totalPages: number }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(
    Number(searchParams.get("page") || "0") + 1
  );

  useEffect(() => {
    //pagination 에서 페이지 변경 됐을 때 감지
    setCurrentPage(Number(searchParams.get("page") || "0") + 1);
  }, [searchParams.get("page")]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = e.target.value;
    setCurrentPage(Number(page));
  };

  const handleBlur = () => {
    //input 포커스에서 벗어났을 때 페이지 적용
    if (currentPage > 0 && currentPage <= totalPages) {
      //실제 페이지 인덱스 업데이트
      searchParams.set("page", String(currentPage - 1));
      setSearchParams(searchParams);
    } else {
      //페이지 인덱스 그대로 유지
      setCurrentPage(Number(searchParams.get("page")) + 1);
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
        max={totalPages}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default PageJump;

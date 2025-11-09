import { memo, useEffect, useState, type ChangeEvent } from "react";
import { usePagination } from "@/hooks/usePagination";

interface PageJumpProps {
  totalPages: number;
}

const PageJump = memo<PageJumpProps>(({ totalPages }) => {
  const { currentPage, goToPage } = usePagination();
  const [inputValue, setInputValue] = useState<number>(currentPage + 1);

  useEffect(() => {
    setInputValue(currentPage + 1);
  }, [currentPage]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setInputValue(value);
  };

  const handleBlur = () => {
    if (inputValue > 0 && inputValue <= totalPages) {
      goToPage(inputValue - 1);
    } else {
      setInputValue(currentPage + 1);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBlur();
    }
  };

  return (
    <div className="text-sm flex items-center gap-[5px]">
      <label htmlFor="page-jump" className="text-gray-500 text-xs">
        페이지 이동
      </label>
      <input
        id="page-jump"
        className="text-center border-1 border-gray-200 rounded-md p-[3px] pl-[10px] w-[50px]"
        type="number"
        value={inputValue}
        min={1}
        max={totalPages}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyPress={handleKeyPress}
        aria-label={`${totalPages} 페이지 중 페이지 번호 입력`}
      />
    </div>
  );
});

PageJump.displayName = "PageJump";

export default PageJump;

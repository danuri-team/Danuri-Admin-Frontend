import { CiFileOn } from "react-icons/ci";
import { CiSquarePlus } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import { CiGrid41 } from "react-icons/ci";
import { CiTrash } from "react-icons/ci";
import type { JSX } from "react";

type TableButtonType = {
  value: ButtonLabel;
  onClick?: () => void;
  isDeleteMode?: boolean
};

type ButtonLabel = "다운로드" | "추가" | "삭제" | "검색" | "대여관리";

const buttonIcon: Record<ButtonLabel, JSX.Element> = {
  다운로드: <CiFileOn size={20} />,
  추가: <CiSquarePlus  size={20} />,
  대여관리: <CiGrid41 size={20} />,
  검색: <CiSearch size={20} />,
  삭제: <CiTrash size={20} />,
};

const TableButton = ({ value, onClick, isDeleteMode }: TableButtonType) => {
  return (
    <button
      className={`${isDeleteMode ? 'hover:bg-red-100 hover:text-red-400' : undefined} flex items-center text-danuri-text bg-gray-100 p-[10px] pr-[15px] pl-[15px] text-sm rounded-xl cursor-pointer`}
      onClick={onClick}
    >
      {buttonIcon[value]}
      <span className="ml-[8px]">{value}</span>
    </button>
  );
};

export default TableButton;

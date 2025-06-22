import { IoDocumentTextOutline } from "react-icons/io5";
import { CiSquarePlus } from "react-icons/ci";
import { IoIosSearch } from "react-icons/io";
import { BsGrid } from "react-icons/bs";
import { HiOutlineTrash } from "react-icons/hi2";
import type { JSX } from "react";

type TableButtonType = {
  value: string;
  onClick?: () => void;
};

type ButtonLabel = "다운로드" | "추가" | "삭제" | "검색" | "대여관리";

const buttonIcon: Record<ButtonLabel, JSX.Element> = {
  다운로드: <IoDocumentTextOutline size={20} />,
  추가: <CiSquarePlus size={20} />,
  대여관리: <BsGrid size={20} />,
  검색: <IoIosSearch size={20} />,
  삭제: <HiOutlineTrash size={20} />,
};

//수정사항: 각 아이콘의 굵기와 크기가 일관되지 않음 -> 최대한 같은 라이브러리의? 아이콘으로 수정
const TableButton = ({ value, onClick }: TableButtonType) => {
  return (
    <button
      className="flex items-center bg-gray-100 p-[10px] pr-[15px] pl-[15px] text-sm rounded-xl cursor-pointer"
      onClick={onClick}
    >
      {buttonIcon[value as ButtonLabel]}
      <span className="ml-[8px]">{value}</span>
    </button>
  );
};

export default TableButton;

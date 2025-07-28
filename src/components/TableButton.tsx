import { CiFileOn } from "react-icons/ci";
import { CiSquarePlus } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import { CiGrid41 } from "react-icons/ci";
import { CiTrash } from "react-icons/ci";
import { CiEdit } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";
import type { JSX } from "react";

type TableButtonType = {
  value: ButtonLabel;
  onClick?: () => void;
  isDeleteMode?: boolean
};

type ButtonLabel = "다운로드" | "추가" | "삭제" | "검색" | "대여관리" | "가입 폼 관리" | "강제퇴실";

const buttonIcon: Record<ButtonLabel, JSX.Element> = {
  다운로드: <CiFileOn size={20} />,
  추가: <CiSquarePlus  size={20} />,
  대여관리: <CiGrid41 size={20} />,
  검색: <CiSearch size={20} />,
  삭제: <CiTrash size={20} />,
  강제퇴실: <CiLogout size={20} />,
  "가입 폼 관리": <CiEdit size={20} />
};

const TableButton = ({ value, onClick, isDeleteMode }: TableButtonType) => {
  const handleStyle = () => {
    if(isDeleteMode){
      return "text-white bg-red-500"
    }
    else return "text-danuri-text bg-gray-100"
  }

  return (
    <button
      className={`${handleStyle()} flex items-center p-[10px] pr-[15px] pl-[10px] text-sm rounded-xl cursor-pointer`}
      onClick={onClick}
    >
      {buttonIcon[value]}
      <span className="ml-[5px]">{value}</span>
    </button>
  );
};

export default TableButton;

import AddIcon from "../assets/icons/add-icon.svg?react";
import FileIcon from "../assets/icons/file-icon.svg?react";
import GridIcon from "../assets/icons/grid-icon.svg?react";
import LeaveIcon from "../assets/icons/leave-icon.svg?react";
import PenIcon from "../assets/icons/pen-icon.svg?react";
import SearchIcon from "../assets/icons/search-icon.svg?react";
import DeleteIcon from "../assets/icons/delete-icon.svg?react";

import type { JSX } from "react";

type TableButtonType = {
  value: ButtonValues;
  onClick?: () => void;
  isDeleteMode?: boolean;
};

type ButtonValues =
  | "다운로드"
  | "추가"
  | "삭제"
  | "검색"
  | "대여관리"
  | "가입 폼 관리"
  | "강제퇴실";

//한글 수정
const buttonIcon: Record<string, { value: ButtonValues; icon: JSX.Element }> = {
  download: { value: "다운로드", icon: <FileIcon /> },
  add: { value: "추가", icon: <AddIcon /> },
  rental: { value: "대여관리", icon: <GridIcon /> },
  search: { value: "검색", icon: <SearchIcon /> },
  leave: { value: "강제퇴실", icon: <LeaveIcon /> },
  form: { value: "가입 폼 관리", icon: <PenIcon /> },
  delete: { value: "삭제", icon: <DeleteIcon /> },
};

const TableButton = ({ value, onClick, isDeleteMode }: TableButtonType) => {
  const icon = Object.entries(buttonIcon).find((item) => item[1].value == value)?.[1].icon;
  const handleStyle = () => {
    if (isDeleteMode) {
      return "text-white bg-red-500";
    } else return "text-danuri-gray bg-gray-100";
  };

  return (
    <button
      className={`${handleStyle()} flex items-center p-[8px] pr-[20px] pl-[20px] text-sm rounded-lg cursor-pointer`}
      onClick={onClick}
    >
      {icon}
      <span className="ml-[5px] text-[15px]">{value}</span>
    </button>
  );
};

export default TableButton;

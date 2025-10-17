import AddIcon from "../assets/icons/add-icon.svg?react";
import DeleteIcon from "../assets/icons/delete-icon.svg?react";
import FileIcon from "../assets/icons/file-icon.svg?react";
import GridIcon from "../assets/icons/grid-icon.svg?react";
import LeaveIcon from "../assets/icons/leave-icon.svg?react";
import PenIcon from "../assets/icons/pen-icon.svg?react";
import SearchIcon from "../assets/icons/search-icon.svg?react";

import type { JSX } from "react";

type TableButtonType = {
  value: ButtonLabel;
  onClick?: () => void;
  isDeleteMode?: boolean;
};

type ButtonLabel = "다운로드" | "추가" | "삭제" | "검색" | "대여관리" | "가입 폼 관리" | "강제퇴실";

const buttonIcon: Record<ButtonLabel, JSX.Element> = {
  다운로드: <FileIcon />,
  추가: <AddIcon />,
  대여관리: <GridIcon />,
  검색: <SearchIcon />,
  삭제: <DeleteIcon />,
  강제퇴실: <LeaveIcon />,
  "가입 폼 관리": <PenIcon />,
};

const TableButton = ({ value, onClick, isDeleteMode }: TableButtonType) => {
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
      {buttonIcon[value]}
      <span className="ml-[5px] text-[15px]">{value}</span>
    </button>
  );
};

export default TableButton;

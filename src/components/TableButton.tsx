import { memo } from "react";
import AddIcon from "../assets/icons/add-icon.svg?react";
import FileIcon from "../assets/icons/file-icon.svg?react";
import GridIcon from "../assets/icons/grid-icon.svg?react";
import LeaveIcon from "../assets/icons/leave-icon.svg?react";
import PenIcon from "../assets/icons/pen-icon.svg?react";
import SearchIcon from "../assets/icons/search-icon.svg?react";
import DeleteIcon from "../assets/icons/delete-icon.svg?react";
import type { TableButtonProps, ButtonValues } from "@/types/components/button";
import type { JSX } from "react";

const buttonIcons: Record<ButtonValues, JSX.Element> = {
  다운로드: <FileIcon />,
  추가: <AddIcon />,
  대여관리: <GridIcon />,
  검색: <SearchIcon />,
  강제퇴실: <LeaveIcon />,
  "가입 폼 관리": <PenIcon />,
  삭제: <DeleteIcon />,
};

const TableButton = memo<TableButtonProps>(({ value, onClick, isDeleteMode = false }) => {
  const icon = buttonIcons[value];
  const styleClass = isDeleteMode ? "text-white bg-red-500" : "text-danuri-gray bg-gray-100";

  return (
    <button
      className={`${styleClass} flex items-center p-[8px] pr-[20px] pl-[20px] text-sm rounded-lg cursor-pointer`}
      onClick={onClick}
      aria-label={value}
    >
      {icon}
      <span className="ml-[5px] text-[15px]">{value}</span>
    </button>
  );
});

TableButton.displayName = "TableButton";

export default TableButton;

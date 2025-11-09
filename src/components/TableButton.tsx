import { memo } from "react";
import AddIcon from "../assets/icons/add-icon.svg?react";
import FileIcon from "../assets/icons/file-icon.svg?react";
import GridIcon from "../assets/icons/grid-icon.svg?react";
import LeaveIcon from "../assets/icons/leave-icon.svg?react";
import PenIcon from "../assets/icons/pen-icon.svg?react";
import SearchIcon from "../assets/icons/search-icon.svg?react";
import DeleteIcon from "../assets/icons/delete-icon.svg?react";
import type { TableButtonProps } from "@/types/components/button";
import type { JSX } from "react";
import { MODAL_TITLES } from "@/constants/modals";

const buttonIcons: Partial<Record<(typeof MODAL_TITLES)[keyof typeof MODAL_TITLES], JSX.Element>> =
  {
    [MODAL_TITLES.SELF_REPORT]: <FileIcon />,
    [MODAL_TITLES.MONTH_REPORT]: <FileIcon />,
    [MODAL_TITLES.ADD]: <AddIcon />,
    [MODAL_TITLES.RENTAL]: <GridIcon />,
    [MODAL_TITLES.SEARCH]: <SearchIcon />,
    [MODAL_TITLES.FORCED]: <LeaveIcon />,
    [MODAL_TITLES.FORM]: <PenIcon />,
    [MODAL_TITLES.DELETE]: <DeleteIcon />,
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

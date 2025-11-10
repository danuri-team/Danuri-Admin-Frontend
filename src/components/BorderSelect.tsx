import { memo } from "react";
import { IoChevronDown } from "react-icons/io5";

interface BorderSelectProps {
  isMust?: boolean;
  label: string;
  value: string;
}

const BorderSelect = memo<BorderSelectProps>(({ isMust, label, value }) => {
  return (
    <div className="mb-[20px]">
      <p className="text-danuri-text mb-[7px] font-semibold text-sm">
        {label}
        {isMust && <span className="text-red-400"> *</span>}
      </p>
      <div className="flex items-center justify-between border-gray-200 border-1 rounded-xl p-[10px] min-w-2xs max-w-2xl">
        <span>{value}</span>
        <IoChevronDown className="text-gray-400" />
      </div>
    </div>
  );
});

BorderSelect.displayName = "BorderSelect";

export default BorderSelect;

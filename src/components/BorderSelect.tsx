import { IoChevronDown } from "react-icons/io5";

type SelectProps = {
  isMust?: boolean;
  label: string;
  value: string;
};

const BorderSelect = ({ isMust, label, value }: SelectProps) => {
  return (
    <div className="mb-[20px]">
      <p className="text-danuri-text mb-[7px] font-semibold text-sm">
        {label}
        {isMust && <span className="text-red-400"> *</span>}
      </p>
      <div
        className={`flex cursor-pointer items-center justify-between border-gray-200 border-1 rounded-xl p-[10px] min-w-2xs max-w-2xl`}
      >
        <span>{value}</span>
        <IoChevronDown className="text-gray-400" />
      </div>
    </div>
  );
};

export default BorderSelect;

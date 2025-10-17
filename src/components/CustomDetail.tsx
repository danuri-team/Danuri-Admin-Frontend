import { useState, type ChangeEvent } from "react";

type DetailProps = {
  isMust?: boolean;
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
};

const CustomDetail = ({ isMust, label, value, onChange }: DetailProps) => {
  const [isFocus, setIsFocus] = useState<boolean>(false);

  return (
    <div className="mb-[20px]">
      <p className="text-danuri-text mb-[7px] font-semibold text-sm">
        {label}
        {isMust && <span className="text-red-400"> *</span>}
      </p>
      <div
        className={`${isFocus ? "border-blue-400" : "border-gray-200"} border-1 rounded-xl p-[10px] min-w-2xs max-w-2xl`}
      >
        <textarea
          className={`outline-none resize-none placeholder:text-gray-300 w-full text-sm`}
          rows={13}
          cols={50}
          maxLength={2000}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
        />
        <p className="text-sm text-gray-400">{value.length}/2000</p>
      </div>
    </div>
  );
};

export default CustomDetail;

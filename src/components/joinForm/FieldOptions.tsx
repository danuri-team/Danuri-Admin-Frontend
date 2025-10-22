import PhoneIcon from "@/assets/icons/phone-icon.svg?react";
import TextIcon from "@/assets/icons/text-icon.svg?react";
import CheckBoxIcon from "@/assets/icons/checkbox-icon.svg?react";
import ChevronDown from "@/assets/icons/chevron-down.svg?react";
import ChevronUp from "@/assets/icons/chevron-up.svg?react";
import { useState, type JSX } from "react";

type FieldOptions = {
  selectOption: string;
  handleOption: (option: "INPUT" | "CHECK" | "PHONE") => void;
};

const options: { name: string; key: "INPUT" | "CHECK" | "PHONE"; icon: JSX.Element }[] = [
  { name: "객관식", key: "CHECK", icon: <CheckBoxIcon className="w-[18px]" /> },
  { name: "전화번호", key: "PHONE", icon: <PhoneIcon className="w-[18px]" /> },
  { name: "주관식", key: "INPUT", icon: <TextIcon className="w-[18px]" /> },
];

const FieldOptions = ({ selectOption, handleOption }: FieldOptions) => {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const selected = options.find((option) => option.key === selectOption);
  return (
    <div className="w-[335px] relative">
      <button
        className="flex items-center p-[12px] w-full text-gray-500 border-1 border-gray-200 rounded-xl  cursor-pointer justify-between"
        onClick={() => setIsFocus(!isFocus)}
        onBlur={() => setIsFocus(false)}
      >
        <div className="flex items-center gap-[12px]">
          <div>{options.find((option) => option.name === selected?.name)?.icon}</div>
          <p>{selected?.name}</p>
        </div>
        {isFocus ? <ChevronUp /> : <ChevronDown />}
      </button>
      {isFocus && (
        <ul className="border-1 border-gray-200 rounded-xl p-[8px] mt-[8px] absolute bg-white w-full z-3">
          {options.map((item) => (
            <li
              key={item.name}
              className={`${item.name === selectOption ? "bg-gray-100" : null} list-none flex items-center gap-[8px] rounded-xl text-black p-[12px] gap-[12px] cursor-pointer`}
              onMouseDown={() => handleOption(item.key)}
            >
              <div>{item.icon}</div>
              <p>{item.name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FieldOptions;

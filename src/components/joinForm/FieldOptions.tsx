// 사용자 가입폼 관리 - 입력 옵션 선택

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

/**
 * 
 * @param selectOption - 선택된 옵션
 * @param handleOption - 옵션 선택 핸들러
 * @returns 
 */
const FieldOptions = ({ selectOption, handleOption }: FieldOptions) => {
  // 포커스 상태
  const [isFocus, setIsFocus] = useState<boolean>(false);
  // 선택된 옵션 객체
  const selected = options.find((option) => option.key === selectOption);

  return (
    <div className="w-[335px] relative">
      <button
        className="flex items-center p-[12px] w-full text-gray-500 border-1 border-gray-200 rounded-xl  cursor-pointer justify-between"
        onClick={() => setIsFocus(!isFocus)}
        onBlur={() => setIsFocus(false)}
      >
        <div className="flex items-center gap-[12px]">
          <div>{selected?.icon}</div>
          <p>{selected?.name}</p>
        </div>
        {/* 포커스 상태에 따라 펼침 닫힘 아이콘 표시 */}
        {isFocus ? <ChevronUp /> : <ChevronDown />}
      </button>
      {/* 포커스 되어있다면 선택 아이템들 표시 */}
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

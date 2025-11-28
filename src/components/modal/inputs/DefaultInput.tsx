import { useState } from "react";
import ModalInputLayout, { type GenericInputProps } from "../ModalInput";

// 모달 검색 입력박스 컴포넌트
const DefaultInput = ({
  type,
  availableCount,
  label,
  value,
  disabled,
  onChange,
}: GenericInputProps) => {
  const [isFocus, setIsFocus] = useState<boolean>(false);

  return (
    <>
      <ModalInputLayout.Label>{label}</ModalInputLayout.Label>
      <div className="relative">
        <input
          disabled={disabled}
          className={`${isFocus ? "border-blue-400" : "border-gray-200"} w-full border-1 rounded-xl p-[10px] outline-none disabled:select-none disabled:text-gray-300`}
          placeholder={`${label}을 입력해주세요.`}
          type={type}
          min={0}
          {...(type === "number" && availableCount && { max: availableCount })}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          value={value as string | number}
          onChange={
            type === "text" || type === "number" ? (e) => onChange(e.target.value) : undefined
          }
        />
      </div>
    </>
  );
};

export default DefaultInput;

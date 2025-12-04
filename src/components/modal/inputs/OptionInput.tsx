import { useEffect, useState } from "react";
import { type GenericInputProps, ModalInputLayout } from "../ModalInput";
import { changeEnumtoText, selectStatusOption } from "@/utils/StatusSelectOption";

// 모달 검색 입력박스 컴포넌트
const OptionInput = ({ label, value, onChange }: GenericInputProps) => {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const OPTIONS = selectStatusOption(location.pathname as string, label);

  useEffect(() => {
    if (OPTIONS && !value) {
      onChange(OPTIONS[0].value);
    }
  }, [value, OPTIONS]);

  return (
    <>
      <ModalInputLayout.Label>{label}</ModalInputLayout.Label>
      <div className="relative">
        <button
          className={`${isFocus ? "border-blue-400" : "border-gray-200"} flex items-center w-full border-1 rounded-xl p-[12px] cursor-pointer`}
          onClick={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
        >
          {OPTIONS &&
            (value
              ? changeEnumtoText(value as string, location.pathname) || OPTIONS[0].name
              : "알 수 없음")}
        </button>
        {isFocus && OPTIONS && (
          <ModalInputLayout.TermList>
            {OPTIONS.map((option) => (
              <ModalInputLayout.TermItem
                id={String(option.value)}
                value={String(option.name)}
                onClick={() => onChange(option.value)}
              />
            ))}
          </ModalInputLayout.TermList>
        )}
      </div>
    </>
  );
};

export default OptionInput;

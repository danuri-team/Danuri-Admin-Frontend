import { useEffect, useMemo, useState } from "react";
import { type GenericInputProps, ModalInputLayout } from "../ModalInput";
import { changeEnumtoText, selectStatusOption } from "@/utils/StatusSelectOption";
import { useLocation } from "react-router-dom";

// 모달 검색 입력박스 컴포넌트
const OptionInput = ({ label, value, onChange }: GenericInputProps) => {
  const location = useLocation();
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const OPTIONS = useMemo(
    () => selectStatusOption(location.pathname as string, label),
    [location.pathname, label]
  );

  useEffect(() => {
    if (OPTIONS && !value) {
      onChange(OPTIONS[0].value);
    }
  }, [value, OPTIONS, onChange]);

  return (
    <>
      <ModalInputLayout.Label>{label}</ModalInputLayout.Label>
      <div className="relative">
        <button
          type="button"
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
                key={option.value}
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

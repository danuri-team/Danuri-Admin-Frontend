import { useState } from "react";
import { type DateTimeInputProps, ModalInputLayout } from "../ModalInput";
import { ko } from "date-fns/locale";
import DatePicker from "react-datepicker";

// 모달 검색 입력박스 컴포넌트
const DateTimeInput = ({ type, label, value, onChange }: DateTimeInputProps) => {
  const [isFocus, setIsFocus] = useState<boolean>(false);

  return (
    <>
      <ModalInputLayout.Label>{label}</ModalInputLayout.Label>
      <div className="relative">
        <DatePicker
          className={`${isFocus ? "border-blue-400" : "border-gray-200"} w-full border-1 rounded-xl p-[12px] outline-none`}
          calendarClassName="border-gray-100 bg-blue-100 rounded-xl"
          placeholderText={`${label}을 선택해주세요.`}
          selected={value as Date | null}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          locale={ko}
          onChange={onChange as (date: Date | null) => void}
          dateFormat={`${type === "date" ? "yyyy-MM-dd HH:mm" : "HH:mm"}`}
          showTimeSelect
          showTimeSelectOnly={type === "date" ? false : true}
        />
      </div>
    </>
  );
};

export default DateTimeInput;

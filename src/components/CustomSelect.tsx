import { memo, useCallback, useRef, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";

import "../style/DatePicker.css";
import "react-datepicker/dist/react-datepicker.css";

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface CustomSelectProps {
  type: "select" | "date" | "rangeDate";
  options: string[];
  value: string | Date | null | DateRange;
  onChange: (value: any) => void;
}

const CustomSelect = memo<CustomSelectProps>((props) => {
  const { type, options, value, onChange } = props;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const datePickerRef = useRef<DatePicker>(null);

  const handleBlur = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  const handleSelectOption = useCallback(
    (item: string) => {
      onChange(item);
      setIsDropdownOpen(false);
    },
    [onChange]
  );

  const handleDateChange = useCallback(
    (date: Date | null) => {
      if (date) {
        onChange(date);
      }
    },
    [onChange]
  );

  const handleRangeDateChange = useCallback(
    (update: [Date | null, Date | null] | null) => {
      if (update) {
        onChange({ startDate: update[0], endDate: update[1] });
      }
    },
    [onChange]
  );

  if (type === "select") {
    const stringValue = value as string;
    return (
      <div className="text-sm ml-[50px]">
        <button
          className="flex items-center gap-[5px] cursor-pointer text-danuri-text"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          onBlur={handleBlur}
          aria-label={`${stringValue} 선택`}
          aria-expanded={isDropdownOpen}
        >
          {stringValue}
          <IoChevronDown size={20} />
        </button>
        {isDropdownOpen && (
          <ul className="absolute border-1 border-gray-200 rounded-xl p-[10px] w-[300px] mt-[15px] bg-white z-10">
            {options.map((item) => (
              <li
                key={item}
                className={`${item === stringValue ? "bg-gray-100" : "bg-white"} cursor-pointer p-[10px] rounded-lg hover:bg-gray-50`}
                onMouseDown={() => handleSelectOption(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (type === "date") {
    const dateValue = value as Date | null;
    const isValueSet = dateValue !== null;
    return (
      <div className="flex items-center text-danuri-text cursor-pointer text-sm ml-[50px]">
        <DatePicker
          ref={datePickerRef}
          className={`${isValueSet ? "w-[80px]" : "w-[37px]"} outline-none mr-[5px] placeholder:text-danuri-text transition-[width] duration-500 ease-in-out cursor-pointer caret-transparent`}
          calendarClassName="border-gray-100 bg-blue-100 rounded-xl"
          placeholderText={options[0]}
          selected={dateValue}
          locale={ko}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
        />
        <button
          onClick={() => datePickerRef.current?.setOpen(true)}
          aria-label="날짜 선택 열기"
        >
          <IoChevronDown size={20} />
        </button>
      </div>
    );
  }

  const rangeValue = value as DateRange;
  const isValueSet = rangeValue && rangeValue.startDate !== null;
  return (
    <div className="flex items-center text-danuri-text cursor-pointer text-sm ml-[50px]">
      <DatePicker
        selectsRange
        ref={datePickerRef}
        className={`${isValueSet ? "w-[170px]" : "w-[37px]"} outline-none mr-[5px] placeholder:text-danuri-text transition-[width] duration-500 ease-in-out cursor-pointer caret-transparent`}
        placeholderText={options[0]}
        startDate={rangeValue?.startDate || null}
        endDate={rangeValue?.endDate || null}
        locale={ko}
        onChange={handleRangeDateChange}
        dateFormat="yyyy-MM-dd"
      />
      <button
        onClick={() => datePickerRef.current?.setOpen(true)}
        aria-label="날짜 범위 선택 열기"
      >
        <IoChevronDown size={20} />
      </button>
    </div>
  );
});

CustomSelect.displayName = "CustomSelect";

export default CustomSelect;

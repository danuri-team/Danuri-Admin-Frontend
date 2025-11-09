import { ko } from "date-fns/locale/ko";
import { memo, useState } from "react";
import DatePicker from "react-datepicker";
import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";
import { useFocus } from "@/hooks/useFocus";
import { useSearchTerms } from "@/hooks/useSearchTerms";
import type { SearchLabel } from "@/utils/searchTermOption";
import type { CustomInputProps, SearchInputProps, TimeInputProps } from "@/types/components/input";

const isTimeInput = (props: CustomInputProps): props is CustomInputProps & { type: "time" } => {
  return "type" in props && props.type === "time";
};

const isSearchInput = (
  props: CustomInputProps
): props is CustomInputProps & { type: "search" } => {
  return "type" in props && props.type === "search";
};

const CustomInput = memo<CustomInputProps>((props) => {
  const { label, disabled, valid, isMust } = props;
  const [searchInput, setSearchInput] = useState<string>("");
  const { isFocused, onFocus, onBlur } = useFocus();

  const searchTerms = useSearchTerms(
    isSearchInput(props) ? (label as SearchLabel) : "" as SearchLabel,
    searchInput
  );

  const isValid = !isTimeInput(props) && props.value ? props.value.length > 0 : false;

  const onClickSearchTerm = (id: string, name: string) => {
    if (isSearchInput(props)) {
      const searchProps = props as SearchInputProps;
      searchProps.onChange(id);
      setSearchInput(name);
    }
  };

  const borderColor = isValid && valid === false
    ? "border-red-400"
    : isFocused
      ? "border-blue-400"
      : "border-gray-200";

  return (
    <div>
      <p className="text-danuri-text mb-[7px] font-semibold text-sm">
        {label !== "placeholder" && label}
        {isMust && <span className="text-red-400"> *</span>}
      </p>
      <div className={`${borderColor} flex border rounded-xl p-[12px] w-full min-w-2xs`}>
        {isTimeInput(props) ? (
          <DatePicker
            className="w-full outline-none placeholder:text-gray-300"
            calendarClassName="border-gray-100 bg-blue-100 rounded-xl"
            placeholderText={`${label}을 선택해주세요.`}
            selected={(props as TimeInputProps).value}
            onFocus={onFocus}
            onBlur={onBlur}
            locale={ko}
            onChange={(props as TimeInputProps).onChange}
            dateFormat="HH:mm"
            showTimeSelect
            showTimeSelectOnly={true}
          />
        ) : isSearchInput(props) ? (
          <input
            disabled={disabled}
            className="outline-none w-full placeholder:text-gray-300"
            type="text"
            placeholder={`${label}를 검색해주세요`}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        ) : (
          <input
            disabled={disabled}
            className={`${label === "placeholder" ? "text-gray-300" : ""} outline-none w-full placeholder:text-gray-300`}
            type={label === "비밀번호" ? "password" : (props as any).type || "text"}
            placeholder={label !== "placeholder" ? `${label}를 입력해주세요` : ""}
            value={(props as CustomInputProps & { value: string }).value}
            onChange={(props as CustomInputProps & { onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }).onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            autoComplete={(props as CustomInputProps & { autoComplete?: string }).autoComplete}
            name={label === "이메일" ? "email" : label === "비밀번호" ? "password" : undefined}
          />
        )}
        {isValid && (valid === true || valid === false) && (
          <button className={`${isValid && valid === true ? "text-danuri-500" : "text-red-400"}`}>
            {valid === false ? <FaCircleExclamation /> : valid === true && <FaCircleCheck />}
          </button>
        )}
      </div>
      {isValid && valid === false && (
        <p className="text-xs mt-[10px] text-red-500">{`${label} 형식에 맞지 않습니다`}</p>
      )}
      {searchTerms[0] && isFocused && (
        <ul className="absolute w-full border-1 border-gray-200 rounded-xl p-[10px] bg-white mt-[10px] z-1">
          {searchTerms.map((term) => (
            <li
              className="cursor-pointer hover:bg-gray-100 p-[3px] rounded-sm"
              onMouseDown={() => onClickSearchTerm(term.id, term.name)}
              key={term.id}
            >
              {term.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

CustomInput.displayName = "CustomInput";

export default CustomInput;

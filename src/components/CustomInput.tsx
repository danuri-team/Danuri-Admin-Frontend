import { ko } from "date-fns/locale/ko";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { FaCircleCheck } from "react-icons/fa6";
import { FaCircleExclamation } from "react-icons/fa6";
import { getSearchTerm, type SearchLabel } from "../utils/searchTermOption";

type BaseProps = {
  isMust?:boolean;
  label: string;
  valid?: boolean;
  disabled?:boolean;
}

type textProps = BaseProps & {
  type?: Exclude<string, 'time' | 'search'>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

type timeProps = BaseProps & {
  type: 'time';
  value: Date | null;
  onChange: (date: Date | null) => void;
}

type searchProps = BaseProps & {
  type: 'search';
  value: string;
  onChange: (value: string | null) => void;
}

type CustomInputType = textProps | timeProps | searchProps

const isTimeInput = (props:CustomInputType): props is timeProps => {
  return props.type === 'time';
}

const isSearchInput = (props:CustomInputType): props is searchProps => {
  return props.type === "search";
}

const CustomInput = (props: CustomInputType) => {
  const {label, disabled, valid, isMust} = props;
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchTerms, setSearchTerms] = useState<{ name: string; id: string }[]>([]);
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const isValid = !isTimeInput(props) && props.value.length > 0;

  useEffect(() => {
    if (!isSearchInput(props)) return;

    const debouncedTimer = setTimeout(async () => {
      const terms = await getSearchTerm(label as SearchLabel, searchInput);
      setSearchTerms(terms);
    }, 200);

    return () => {
      clearTimeout(debouncedTimer);
    };
  }, [searchInput]);

  const onClickSearchTerm = (id: string, name: string) => {
    if (isSearchInput(props)) {
      props.onChange(id);
      setSearchInput(name);
    }
  };

  return (
    <div>
      <p className="text-danuri-text mb-[7px] font-semibold text-sm">{label!=='placeholder' && label}{isMust && <span className="text-red-400"> *</span>}</p>
      <div
        className={`${isValid && valid === false ? "border-red-400" : isFocus ? "border-blue-400" : "border-gray-200"}  flex border  rounded-xl p-[12px] w-full min-w-2xs`}
      >
        {
          isTimeInput(props) ? (
            <DatePicker
              className={`w-full outline-none placeholder:text-gray-300`}
              calendarClassName="border-gray-100 bg-blue-100 rounded-xl"
              placeholderText={`${label}을 선택해주세요.`}
              selected={props.value}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              locale={ko}
              onChange={props.onChange}
              dateFormat={`${"HH:mm"}`}
              showTimeSelect
              showTimeSelectOnly={true}
            />
          ) 
          : isSearchInput(props) ? (
            <input
              disabled={disabled}
              className="outline-none w-full placeholder:text-gray-300"
              type="text"
              placeholder={`${label}를 검색해주세요`}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
            />
          )
          : (
            <input
              disabled={disabled}
              className={`${label==='placeholder' ? 'text-gray-300' : undefined} outline-none w-full placeholder:text-gray-300`}
              type={label === "비밀번호" ? "password" : "text"}
              placeholder={`${label!=='placeholder' ? `${label}를 입력해주세요` : ''}`}
              value={props.value}
              onChange={props.onChange}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
            />
          )
        }
        {isValid && (valid === true || valid === false) && (
          <button
            className={`${isValid && valid === true ? "text-danuri-500" : "text-red-400"}`}
          >
            {valid === false ? <FaCircleExclamation /> : valid === true && <FaCircleCheck />}
          </button>
        )}
      </div>
      {isValid && valid === false && (
        <p className="text-xs mt-[10px] text-red-500">{`${label} 형식에 맞지 않습니다`}</p>
      )}
      {
        //검색어가 한 개도 없고, 입력박스에 포커싱이 있으면 검색어들 보이게
        searchTerms[0] && isFocus && (
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
        )
      }
    </div>
  );
};

export default CustomInput;

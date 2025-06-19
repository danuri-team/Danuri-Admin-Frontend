import { ko } from "date-fns/locale";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { IoCloseCircleSharp } from "react-icons/io5";
import { getSearchTerm } from "../utils/searchTermOption";

export type ModalInputTypesType = "search" | "date" | "time" | "text" | "number";

type ModalInputType =
  | {
      label: string;
      type: "date" | "time";
      value: Date | null;
      resetValue?: () => void;
      onChange: (date: Date | null) => void;
    }
  | {
      label: string;
      type: "search" | "text" | "number";
      value: string | number;
      resetValue?: () => void;
      onChange: (value: string | number) => void;
    };

const ModalInput = ({ label, value, type, onChange, resetValue }: ModalInputType) => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchTerms, setSearchTerms] = useState<{name:string, id:string}[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(()=>{
    if(type!=='search')return;

    const debouncedTimer = setTimeout(async ()=>{
      const terms = await getSearchTerm(label, searchInput);
      setSearchTerms(terms);
    }, 200);

    return () => {
      clearTimeout(debouncedTimer);
    }

  }, [searchInput]);

  useEffect(()=>{
    if(type==='search' && value===''){
      setSearchInput('');
    }
  },[value]);

  const onClickSearchTerm = (id:string, name:string) => {
    if(type==='search'){
      onChange(id)
      setSearchInput(name);
    }
  }

  return (
    <div className="text-sm mb-[15px]">
      <p className="mb-[5px]">{label}</p>
      {type === "search" ? (
        <div className="relative">
          <div className={`${inputRef.current === document.activeElement ? 'border-blue-400' : 'border-gray-200'} flex items-center w-full border-1 rounded-xl p-[10px]`}>
            <input
              ref={inputRef}
              className="w-full outline-none"
              placeholder={`${label}을 검색해주세요`}
              type="text"
              value={searchInput}
              onChange={(e)=>setSearchInput(e.target.value)}
            />
            {value && (
              <button className="text-gray-300 cursor-pointer" onClick={resetValue}>
                <IoCloseCircleSharp size={16} />
              </button>
            )}
          </div>
          {
            //검색어가 한 개도 없고, 입력박스에 포커싱이 있으면 검색어들 보이게
            searchTerms[0] && inputRef.current && inputRef.current === document.activeElement && (
              <ul className="absolute w-full border-1 border-gray-200 rounded-xl p-[10px] bg-white mt-[10px] z-1">
                {
                  
                  searchTerms.map((term)=>(
                    <li className="cursor-pointer hover:bg-gray-100 p-[3px] rounded-sm" onMouseDown={()=>onClickSearchTerm(term.id, term.name)} key={term.id}>{term.name}</li>
                  ))
                }
              </ul>
            )
          }
        </div>
      ) : type === "date" || type === "time" ? (
        <DatePicker
          className="w-full border-1 border-gray-200 rounded-xl p-[10px] outline-none"
          calendarClassName="border-gray-100 bg-blue-100 rounded-xl"
          placeholderText={`${label}을 선택해주세요.`}
          selected={value as Date | null}
          locale={ko}
          onChange={onChange as (date: Date | null) => void}
          dateFormat={`${type === "date" ? "yyyy-MM-dd HH:mm" : "HH:mm"}`}
          showTimeSelect
          showTimeSelectOnly={type === "date" ? false : true}
        />
      ) : (
        <input
          className="w-full border-1 border-gray-200 rounded-xl p-[10px] outline-none"
          placeholder={`${label}을 입력해주세요.`}
          type={type}
          value={value as string | number}
          onChange={type==='text' || type==='number' ? (e)=> onChange(e.target.value) : undefined }
        />
      )}
    </div>
  );
};

export default ModalInput;

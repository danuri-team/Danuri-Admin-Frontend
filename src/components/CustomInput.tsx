import { ko } from "date-fns/locale/ko";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { FaCircleCheck } from "react-icons/fa6";
import { FaCircleExclamation } from "react-icons/fa6";

type CustomInputType = 
  | {
      type?: string;    
      isMust?: boolean;
      label: string;
      value: string;
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
      valid?: boolean;
      disabled?:boolean
    }
  | {
      type: "time";
      isMust?: boolean;
      label: string;
      value: Date | null;
      onChange: (date: Date | null) => void;
      valid?: boolean;
      disabled?:boolean

  }

const CustomInput = ({ isMust, type, label, value, onChange, valid, disabled }: CustomInputType) => {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  return (
    <div className="mb-[20px]">
      <p className="text-danuri-text mb-[7px] font-semibold text-sm">{label}{isMust && <span className="text-red-400"> *</span>}</p>
      <div
        className={`${type!=='time' && (value as string).length > 0 && valid === false ? "border-red-400" : isFocus ? "border-blue-400" : "border-gray-200"}  flex border  rounded-xl p-[10px] w-full min-w-xs`}
      >
        {
          type==='time' ? (
            <DatePicker
              className={`w-full outline-none placeholder:text-gray-300`}
              calendarClassName="border-gray-100 bg-blue-100 rounded-xl"
              placeholderText={`${label}을 선택해주세요.`}
              selected={value as Date | null}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              locale={ko}
              onChange={onChange as (date:Date|null)=>void}
              dateFormat={`${"HH:mm"}`}
              showTimeSelect
              showTimeSelectOnly={true}
            />
          ) 
          : (
            <input
              disabled={disabled}
              className="outline-none w-full placeholder:text-gray-300"
              type={label === "비밀번호" ? "password" : "text"}
              placeholder={`${label}를 입력해주세요`}
              value={value as string}
              onChange={onChange as (e:React.ChangeEvent<HTMLInputElement>)=>void}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
            />
          )
        }
        {type!=='time' && (value as string).length > 0 && (valid === true || valid === false) && (
          <button
            className={`${type!=='time' && (value as string).length > 0 && valid === true ? "text-danuri-500" : "text-red-400"}`}
          >
            {valid === false ? <FaCircleExclamation /> : valid === true && <FaCircleCheck />}
          </button>
        )}
      </div>
      {type!=='time' && (value as string).length > 0 && valid === false && (
        <p className="text-xs mt-[10px] text-red-500">{`${label} 형식에 맞지 않습니다`}</p>
      )}
    </div>
  );
};

export default CustomInput;

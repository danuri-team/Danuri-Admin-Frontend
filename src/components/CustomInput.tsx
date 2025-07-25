import { ko } from "date-fns/locale/ko";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { FaCircleCheck } from "react-icons/fa6";
import { FaCircleExclamation } from "react-icons/fa6";

type BaseProps = {
  isMust?:boolean;
  label: string;
  valid?: boolean;
  disabled?:boolean;
}

type textProps = BaseProps & {
  type?: Exclude<string, 'time'>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

type timeProps = BaseProps & {
  type: 'time';
  value: Date | null;
  onChange: (date: Date | null) => void;
}

type CustomInputType = textProps | timeProps

const isTimeInput = (props:CustomInputType): props is timeProps => {
  return props.type === 'time';
}

const CustomInput = (props: CustomInputType) => {
  const {label, disabled, valid, isMust} = props;
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const isValid = !isTimeInput(props) && props.value.length > 0

  return (
    <div className="mb-[20px]">
      <p className="text-danuri-text mb-[7px] font-semibold text-sm">{label}{isMust && <span className="text-red-400"> *</span>}</p>
      <div
        className={`${isValid && valid === false ? "border-red-400" : isFocus ? "border-blue-400" : "border-gray-200"}  flex border  rounded-xl p-[10px] w-full min-w-2xs`}
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
          : (
            <input
              disabled={disabled}
              className="outline-none w-full placeholder:text-gray-300"
              type={label === "비밀번호" ? "password" : "text"}
              placeholder={`${label}를 입력해주세요`}
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
    </div>
  );
};

export default CustomInput;

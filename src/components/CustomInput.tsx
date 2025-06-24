import { useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { FaCircleExclamation } from "react-icons/fa6";

type CustomInputType = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  valid?: boolean;
  disabled?:boolean
};

const CustomInput = ({ label, value, onChange, valid, disabled }: CustomInputType) => {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  return (
    <div className="mb-[30px]">
      <p className="text-danuri-text mb-[10px]">{label}</p>
      <div
        className={`${value.length > 0 && valid === false ? "border-red-400" : isFocus ? "border-blue-400" : "border-gray-200"}  flex border  rounded-xl p-[13px] w-full min-w-xs`}
      >
        <input
          disabled={disabled}
          className="outline-none w-full placeholder:text-gray-300"
          type={label === "비밀번호" ? "password" : "text"}
          placeholder={`${label}를 입력해주세요`}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
        />
        {value.length > 0 && (valid === true || valid === false) && (
          <button
            className={`${value.length > 0 && valid === true ? "text-danuri-500" : "text-red-400"}`}
          >
            {valid === false ? <FaCircleExclamation /> : valid === true && <FaCircleCheck />}
          </button>
        )}
      </div>
      {value.length > 0 && valid === false && (
        <p className="text-xs mt-[10px] text-red-500">{`${label} 형식에 맞지 않습니다`}</p>
      )}
    </div>
  );
};

export default CustomInput;

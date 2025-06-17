import { ko } from "date-fns/locale";
import DatePicker from "react-datepicker";
import { IoCloseCircleSharp } from "react-icons/io5";

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
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    };

const ModalInput = ({ label, value, type, onChange, resetValue }: ModalInputType) => {
  return (
    <div className="text-sm mb-[15px]">
      <p className="mb-[5px]">{label}</p>
      {type === "search" ? (
        <div className="flex items-center w-full border-1 border-gray-200 rounded-xl p-[10px] ">
          <input
            className="w-full outline-none"
            placeholder={`${label}을 검색해주세요`}
            type="text"
            value={value as string}
            onChange={onChange}
          />
          {value && (
            <button className="text-gray-300 cursor-pointer" onClick={resetValue}>
              <IoCloseCircleSharp size={16} />
            </button>
          )}
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
          value={value as string}
          onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
        />
      )}
    </div>
  );
};

export default ModalInput;

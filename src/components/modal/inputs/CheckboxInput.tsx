import { IoIosCheckmark } from "react-icons/io";
import { ModalInputLayout, type GenericInputProps } from "../ModalInput";

const CheckboxInput = ({ type, label, value, onChange }: GenericInputProps) => {
  return (
    <>
      <ModalInputLayout.Label>{label}</ModalInputLayout.Label>
      <div className="relative p-[10px] pl-4">
        <label className="relative" htmlFor="checkbox">
          <input
            className="cursor-pointer appearance-none w-[15px] h-[15px] border-1 rounded-sm border-gray-300 checked:border-danuri-500 checked:bg-danuri-500"
            type={type}
            checked={!!value}
            onChange={() => {
              onChange(!value);
            }}
          />
          {value && (
            <IoIosCheckmark
              onClick={(e) => {
                e.stopPropagation();
                onChange(!value);
              }}
              className="absolute inset-0 cursor-pointer"
              color="white"
            />
          )}
        </label>
      </div>
    </>
  );
};

export default CheckboxInput;

import { ModalInputLayout, type GenericInputProps } from "../ModalInput";

const CheckboxInput = ({ type, label, value, onChange }: GenericInputProps) => {
  return (
    <>
      <ModalInputLayout.Label>{label}</ModalInputLayout.Label>
      <div className="relative">
        <input
          className="cursor-pointer appearance-none w-[15px] h-[15px] border-1 rounded-sm border-gray-300 checked:border-danuri-500 checked:bg-danuri-500"
          type={type}
          checked={!!value}
          onChange={() => {
            onChange(!value);
          }}
        />
      </div>
    </>
  );
};

export default CheckboxInput;

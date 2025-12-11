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
            <span
              onClick={(e) => {
                e.stopPropagation();
                onChange(!value);
              }}
              className="icon-[lucide--check] w-3 h-3 text-white absolute inset-0 left-0.5 top-0.5 cursor-pointer"
              color="white"
            />
          )}
        </label>
      </div>
    </>
  );
};

export default CheckboxInput;

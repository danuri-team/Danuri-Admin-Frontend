type CustomButtonType = {
  value: string;
  onClick: () => void;
  type?: "button" | "submit" | "reset";
};

const CustomButton = ({ value, onClick, type = "button" }: CustomButtonType) => {
  return (
    <button
      type={type}
      className="rounded-xl p-[12px] w-full bg-danuri-500 text-white font-semibold cursor-pointer hover:bg-danuri-600"
      onClick={onClick}
    >
      {value}
    </button>
  );
};

export default CustomButton;

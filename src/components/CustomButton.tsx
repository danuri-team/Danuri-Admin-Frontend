import { memo } from "react";
import type { CustomButtonProps } from "@/types/components/button";

const CustomButton = memo<CustomButtonProps>(
  ({ value, onClick, type = "button", variant = "primary", disabled = false, ...props }) => {
    const variantStyles = {
      primary: "bg-danuri-500 hover:bg-danuri-600 text-white",
      secondary: "bg-gray-100 hover:bg-gray-200 text-danuri-gray",
      danger: "bg-red-500 hover:bg-red-600 text-white",
    };

    return (
      <button
        type={type}
        className={`rounded-xl p-[12px] w-full font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]}`}
        onClick={onClick}
        disabled={disabled}
        aria-label={value}
        {...props}
      >
        {value}
      </button>
    );
  }
);

CustomButton.displayName = "CustomButton";

export default CustomButton;

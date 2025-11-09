import type { MODAL_TITLES } from "@/constants/modals";
import type { ButtonHTMLAttributes } from "react";

export interface CustomButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  value: string;
  onClick: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}

export interface TableButtonProps {
  value: (typeof MODAL_TITLES)[keyof typeof MODAL_TITLES];
  onClick?: () => void;
  isDeleteMode?: boolean;
}

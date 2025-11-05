import type { ButtonHTMLAttributes } from "react";

export interface CustomButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  value: string;
  onClick: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}

export type ButtonValues =
  | "다운로드"
  | "추가"
  | "삭제"
  | "검색"
  | "대여관리"
  | "가입 폼 관리"
  | "강제퇴실";

export interface TableButtonProps {
  value: ButtonValues;
  onClick?: () => void;
  isDeleteMode?: boolean;
}

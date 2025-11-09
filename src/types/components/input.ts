import type { ChangeEvent } from "react";

export interface BaseInputProps {
  isMust?: boolean;
  label: string;
  valid?: boolean;
  disabled?: boolean;
}

export interface TextInputProps extends BaseInputProps {
  type?: "text" | "password" | "email" | "number" | string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
}

export interface TimeInputProps extends BaseInputProps {
  type: "time";
  value: Date | null;
  onChange: (date: Date | null) => void;
}

export interface SearchInputProps extends BaseInputProps {
  type: "search";
  value: string;
  onChange: (value: string | null) => void;
}

export type CustomInputProps = TextInputProps | TimeInputProps | SearchInputProps;

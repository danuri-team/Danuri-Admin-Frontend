// 모달 관련 타입 모음

import type { MODAL_TITLES } from "@/constants/modals";

// 모달 입력 박스 타입
export type ModalInputTypesType =
  | "search"
  | "date"
  | "time"
  | "text"
  | "number"
  | "option"
  | "image";

// 모달 입력 타입
export interface ModalInput {
  label: string;
  key: string;
  type: ModalInputTypesType;
  initial?: string | number | Date;
  hide?: boolean;
}

// 모달 Submit 함수 타입
export type ModalSubmitFnType = (form: modalState) => Promise<{
  data: unknown;
  pass: boolean;
}>;

// 모달 컴포넌트 타입
export type ModalType = {
  isOpen: boolean;
  title: (typeof MODAL_TITLES)[keyof typeof MODAL_TITLES];
  inputs:
    | {
        label: string;
        key: string;
        type: ModalInputTypesType;
        initial?: string | number | Date;
        hide?: boolean;
        disable?: boolean;
      }[]
    | null;
  onClose: () => void;
  onSubmit: ModalSubmitFnType | ((form: modalState) => void);
};

// 모달 리듀서 액션 타입
export type modalAction =
  | { type: "CHANGE"; payload: { key: string; value: string | number } }
  | { type: "CHANGE_DATE"; payload: { key: string; value: Date | null } }
  | { type: "RESET_ITEM"; payload: { key: string; type: ModalInputTypesType } }
  | { type: "RESET"; payload: { initialModalForm: modalState } };

// 모달 리듀서 State 타입
export type modalState = Record<string, Date | string | number | null>;

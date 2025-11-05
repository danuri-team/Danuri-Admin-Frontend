import { useState, useCallback } from "react";
import type { ModalInput } from "@/types/modal";
import type { MODAL_TITLES } from "@/constants/modals";

interface UseModalReturn {
  isOpen: boolean;
  inputs: ModalInput[] | null;
  title: (typeof MODAL_TITLES)[keyof typeof MODAL_TITLES] | null;
  openModal: (
    title: (typeof MODAL_TITLES)[keyof typeof MODAL_TITLES],
    inputs?: ModalInput[]
  ) => void;
  closeModal: () => void;
  setInputs: (inputs: ModalInput[] | null) => void;
}

export const useModal = (): UseModalReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputs, setInputs] = useState<ModalInput[] | null>(null);
  const [title, setTitle] = useState<(typeof MODAL_TITLES)[keyof typeof MODAL_TITLES] | null>(null);

  const openModal = useCallback(
    (modalTitle: (typeof MODAL_TITLES)[keyof typeof MODAL_TITLES], modalInputs?: ModalInput[]) => {
      setTitle(modalTitle);
      if (modalInputs) {
        setInputs(modalInputs);
      }
      setIsOpen(true);
    },
    []
  );

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setInputs(null);
    setTitle(null);
  }, []);

  return {
    isOpen,
    inputs,
    title,
    openModal,
    closeModal,
    setInputs,
  };
};

// 모달 입력 옵션을 생성하는 헬퍼 함수
export const createModalInputOptions = (
  inputs: ModalInput[],
  titles: (typeof MODAL_TITLES)[keyof typeof MODAL_TITLES][]
): Partial<Record<(typeof MODAL_TITLES)[keyof typeof MODAL_TITLES], ModalInput[]>> => {
  const options: Partial<Record<(typeof MODAL_TITLES)[keyof typeof MODAL_TITLES], ModalInput[]>> =
    {};

  titles.forEach((title) => {
    if (title === "추가") {
      options[title] = inputs;
    } else if (title === "수정") {
      options[title] = inputs.map((input) =>
        input.key === "id" ? { ...input, hide: true } : input
      );
    } else if (title === "검색") {
      options[title] = inputs;
    }
  });

  return options;
};

import { useEffect, useReducer } from "react";
import { IoCloseOutline } from "react-icons/io5";
import ModalInput, { type ModalInputTypesType } from "./ModalInput";
import CustomButton from "./CustomButton";
import type { ModalSubmitFn } from "../pages/ItemManagementPage";

type ModalType = {
  isOpen: boolean;
  title: string;
  inputs: { label: string; key: string, type: ModalInputTypesType }[] | null;
  onClose: () => void;
  onSubmit: ModalSubmitFn
};

type modalAction =
  | { type: "CHANGE"; payload: { key: string; value: string | number } }
  | { type: "CHANGE"; payload: { key: string; value: Date | null } }
  | { type: "RESET_ITEM"; payload: { key: string; type: ModalInputTypesType } }
  | { type: "RESET"; payload: { initailModalForm: modalState } };

type modalState = Record<string, Date | string | number | null>;

const modalReducer = (state: modalState, action: modalAction) => {
  switch (action.type) {
    case "CHANGE":
      console.log(state);
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    case "RESET_ITEM":
      console.log(state);
      return {
        ...state,
        [action.payload.key]:
          action.payload.type === "date" || action.payload.type === "time"
            ? null
            : action.payload.type === "number"
              ? 0
              : "",
      };
    case "RESET":
      return action.payload.initailModalForm;
  }
};

const getInitialModalForm = (
  inputs: { label: string; key:string, type: ModalInputTypesType }[] | null
): modalState => {
  if (!inputs) return {};

  const initialState: modalState = {};
  inputs.forEach((input) => {
    initialState[input.key] =
      input.type === "date" || input.type === "time"
        ? null
        : input.type === "number"
          ? 0
          : "";
  });
  return initialState;
};

const Modal = ({ isOpen, title, onClose, inputs, onSubmit }: ModalType) => {
  const [modalForm, modalDispatch] = useReducer(modalReducer, getInitialModalForm(inputs));

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const onClickSubmitModal = async () => {
    const res = await onSubmit(modalForm);
    if(res.pass){
      onClose();
    }
    else {
      console.log('실패');
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <div className="absolute inset-0 h-screen bg-black opacity-[70%]"></div>
      {isOpen && (
        <div className="relative w-sm bg-white bg-opacity-[100%] rounded-xl p-[20px] pt-[20px]">
          <div className="flex justify-center mb-[30px]">
            <button className="absolute right-[25px]" onClick={onClose}>
              <IoCloseOutline size={25} />
            </button>
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
          <div className="p-[10px] mb-[15px]">
            {inputs?.map((item) =>
              item.type === "date" || item.type === "time" ? (
                <ModalInput
                  key={item.label}
                  label={item.label}
                  type={item.type}
                  onChange={(date) =>
                    modalDispatch({ type: "CHANGE", payload: { key: item.key, value: date } })
                  }
                  value={modalForm[item.key] as Date | null}
                  resetValue={() =>
                    modalDispatch({
                      type: "RESET_ITEM",
                      payload: { key: item.key, type: item.type },
                    })
                  }
                />
              ) : (
                <ModalInput
                  key={item.label}
                  label={item.label}
                  type={item.type}
                  onChange={(e) =>
                    modalDispatch({
                      type: "CHANGE",
                      payload: { key: item.key, value: e.target.value },
                    })
                  }
                  value={modalForm[item.key] as string | number}
                  resetValue={() =>
                    modalDispatch({
                      type: "RESET_ITEM",
                      payload: { key: item.key, type: item.type },
                    })
                  }
                />
              )
            )}
          </div>
          <CustomButton value={title} onClick={() => onClickSubmitModal()} />
        </div>
      )}
    </div>
  );
};

export default Modal;

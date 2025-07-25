import { useEffect, useReducer, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import ModalInput, { type ModalInputTypesType } from "./ModalInput";
import CustomButton from "../CustomButton";
import type { ModalSubmitFn } from "../../pages/ItemManagementPage";
import { getMyInfo } from "../../api/InfoAPI";
import { useLocation } from "react-router-dom";
import { selectTermAvailableCount } from "../../utils/searchTermOption";

type ModalType = {
  isOpen: boolean;
  title: string;
  inputs: { label: string; key: string; type: ModalInputTypesType, initial?: string | number | Date, hide?: boolean, disable?:boolean }[] | null;
  onClose: () => void; 
  onSubmit: ModalSubmitFn | ((form:modalState) => void);
};

type modalAction =
  | { type: "CHANGE"; payload: { key: string; value: string | number } }
  | { type: "CHANGE_DATE"; payload: { key: string; value: Date | null } }
  | { type: "RESET_ITEM"; payload: { key: string; type: ModalInputTypesType } }
  | { type: "RESET"; payload: { initailModalForm: modalState } };

type modalState = Record<string, Date | string | number | null>;

const modalReducer = (state: modalState, action: modalAction) => {
  switch (action.type) {
    case "CHANGE":
      if(action.payload.key==='available_quantity' && (state.total_quantity as number) < (action.payload.value as number)){
        return {...state};
      }
      if(action.payload.key==='returned_quantity' && (state.quantity as number) < (action.payload.value as number)){
        return {...state};
      }
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    case "CHANGE_DATE":
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    case "RESET_ITEM":
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
  inputs: { label: string; key: string; type: ModalInputTypesType, initial?: string | number | Date  }[] | null
): modalState => {
  if (!inputs) return {};

  const initialState: modalState = {};
  inputs.forEach((input) => {
    if(!input.initial){
      initialState[input.key] =
          input.type === "date" || input.type === "time" ? null : input.type === "number" ? 0 : "";
    }
    else {
      initialState[input.key] = input.initial;
    }
  });
  return initialState;
};


const Modal = ({ isOpen, title, onClose, inputs, onSubmit }: ModalType) => {
  const location = useLocation();
  const [modalForm, modalDispatch] = useReducer(modalReducer, getInitialModalForm(inputs));
  const [availableCount, setAvailableCount] = useState<number>(0);

  useEffect(() => {
    if (isOpen){
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(()=>{
    if(location.pathname !== '/rental')return;
    if((title==='추가' && !modalForm.itemId) || (title==='수정' && !modalForm.rentalId))return;
    const getCount = async () => {
      const count = await selectTermAvailableCount(title==='추가' ? modalForm.itemId as string : modalForm.rentalId as string);
      if(!isNaN(Number(count)))setAvailableCount(Number(count));
      else setAvailableCount(0);
    } 
    getCount();
  },[modalForm.itemId, modalForm.rentalId, title, location]);

  const getMyCompanyId = async () => {
    const res = await getMyInfo();
    if(res.pass){
      modalDispatch({type:'CHANGE', payload:{key:'company_id', value: res.data.company_id}});
    }
  }
  

  const onClickSubmitModal = async () => {
    const res = await onSubmit(modalForm) as { data: unknown; pass: boolean; }
    if (res.pass) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-5">
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
            {inputs?.map((item) =>{
              if(item.key==='company_id'){
                getMyCompanyId();
              }
              if(item.hide)return;
              
              return item.type === "date" || item.type === "time" ? (
                <ModalInput
                  disable={item.disable}
                  key={item.label}
                  label={item.label}
                  type={item.type}
                  onChange={(date) =>
                    modalDispatch({ type: "CHANGE_DATE", payload: { key: item.key, value: date } })
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
                  disable={item.disable}
                  key={item.label}
                  label={item.label}
                  type={item.type}
                  availableCount={availableCount}
                  onChange={(value) =>
                    modalDispatch({
                      type: "CHANGE",
                      payload: { key: item.key, value: value },
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
            })}
          </div>
          <CustomButton value={title} onClick={title==='검색' ? ()=> {onSubmit(modalForm); onClose()} : (() => onClickSubmitModal()) as ()=>void} />
        </div>
      )}
    </div>
  );
};

export default Modal;

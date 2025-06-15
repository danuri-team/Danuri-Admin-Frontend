import { useEffect, useReducer } from "react";
import { IoCloseOutline } from "react-icons/io5";
import ModalInput, { type ModalInputTypesType } from "./ModalInput";
import CustomButton from "./CustomButton";

type ModalType = {
    isOpen:boolean,
    title: string,
    inputs: {label:string, type: ModalInputTypesType}[] | null,
    onClose: () => void
}

type modalAction = 
    | {type: 'CHANGE', payload: {key: string, value: string | number}}
    | {type: 'CHANGE', payload: {key: string, value: Date | null}}
    | {type: 'RESET', payload: {initailModalForm: modalState}}

type modalState = Record<string, Date | string | number | null>

const modalReducer = (state:modalState, action:modalAction) => {
    switch(action.type){
        case 'CHANGE':
            return {
                ...state,
                [action.payload.key] : action.payload.value
            }
        case 'RESET':
            return action.payload.initailModalForm;
    }
}

const getInitialModalForm = (inputs:{label:string, type: ModalInputTypesType}[] | null):modalState => {
    if(!inputs)return {};

    const initialState:modalState = {};
    inputs.forEach((input) => {
        initialState[input.label] = input.type === 'date' ? new Date() : input.type === 'number' ? 0 : '';
    })
    return initialState;
}

const Modal = ({isOpen, title, onClose, inputs}: ModalType) => {

    const [modalForm, modalDispatch] = useReducer(modalReducer, getInitialModalForm(inputs));

    useEffect(() => {
        if(isOpen)document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "auto"
        }
    }, [isOpen]);

    const onClickSubmitModal = () => {

    }

    return(
        <div className="fixed inset-0 flex justify-center items-center">
            <div className="absolute inset-0 h-screen bg-black opacity-[70%]"></div>
        {
            isOpen && (
                <div className="relative w-sm bg-white bg-opacity-[100%] rounded-xl p-[20px] pt-[20px]">
                    <div className="flex justify-center mb-[30px]">
                        <button className="absolute right-[25px]" onClick={onClose}><IoCloseOutline size={25}/></button>
                        <h2 className="text-lg font-semibold">{title}</h2>
                    </div>
                    <div className="p-[10px] mb-[15px]">
                    {
                        inputs?.map((item) =>
                            item.type === 'date' ? (
                                <ModalInput label={item.label} type={item.type} onChange={(date)=>modalDispatch({type:'CHANGE', payload:{key:item.label, value: date }})} value={modalForm[item.label] as Date | null} />
                            )  : (
                                <ModalInput label={item.label} type={item.type} onChange={(e)=>modalDispatch({type:'CHANGE', payload: {key: item.label, value: e.target.value}})} value={modalForm[item.label] as string | number} />
                            )
                        )
                    }
                    </div>
                    <CustomButton value={title} onClick={()=>onClickSubmitModal}/>
                </div>
            )
        }
        </div>
    )
}

export default Modal;
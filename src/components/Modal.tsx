import { useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";
import ModalInput from "./ModalInput";
import CustomButton from "./CustomButton";

type ModalType = {
    isOpen:boolean,
    title: string,
    inputs: any[] | null,
    onClose: () => void
}

const Modal = ({isOpen, title, onClose, inputs}: ModalType) => {
    useEffect(() => {
        if(isOpen)document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "auto"
        }
    }, [isOpen]);

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
                        inputs?.map((item) => (
                            <ModalInput label={item.label} type={item.type} />
                        ))
                    }
                    </div>
                    <CustomButton value={title} />
                </div>
            )
        }
        </div>
    )
}

export default Modal;
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import DeleteIcon from "../../assets/icons/delete-icon.svg?react";
import GripIcon from "../../assets/icons/grip-icon.svg?react";
import PasteIcon from "../../assets/icons/paste-icon.svg?react";
import FieldOptions from "./FieldOptions";
import { useState } from "react";

const FormItem = ({id}:{id:number}) => {
    const { attributes, setNodeRef, listeners, transform, transition } = useSortable({id});
    const [selectOption, setSelectOption] = useState<string>('객관식');

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const handleOption = (option:string) => {
        setSelectOption(option);
    }

    return(
        <div 
            className="flex flex-col border-1 border-gray-200 mb-[30px] rounded-xl p-[25px] bg-white"
            ref={setNodeRef} 
            style={style} 
            {...attributes}>
            <button className="text-gray-400 cursor-pointer hover:bg-gray-100 p-[5px] rounded-sm self-center" {...listeners} aria-label="drag handle">
                <GripIcon />
            </button>
            <FieldOptions handleOption={handleOption} selectOption={selectOption} />
            <div>
                <button className="text-gray-500 cursor-pointer hover:bg-gray-100 p-[5px] rounded-sm">
                    <PasteIcon  />
                </button>
                <button className="text-gray-500 cursor-pointer hover:bg-gray-100 p-[5px] rounded-sm">
                    <DeleteIcon  />
                </button>
            </div>
        </div>
    )
}

export default FormItem;
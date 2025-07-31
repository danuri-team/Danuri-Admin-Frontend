import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import DeleteIcon from "../../assets/icons/delete-icon.svg?react";
import GripIcon from "../../assets/icons/grip-icon.svg?react";
import PasteIcon from "../../assets/icons/paste-icon.svg?react";

const FormItem = ({id}:{id:number}) => {
    const { attributes, setNodeRef, listeners, transform, transition } = useSortable({id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    return(
        <div 
            className="flex flex-col items-center border-1 border-gray-200 mb-[30px] rounded-xl p-[25px]"
            ref={setNodeRef} 
            style={style} 
            {...attributes}>
            <button className="text-gray-300 cursor-pointer hover:bg-gray-100 p-[5px] rounded-sm" {...listeners} aria-label="drag handle">
                <GripIcon />
            </button>
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
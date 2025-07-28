import { LuMenu } from "react-icons/lu";
import { PiCopySimpleLight } from "react-icons/pi";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CiTrash } from "react-icons/ci";

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
                <LuMenu  size={20}/>
            </button>
            <div>
                <button className="text-gray-500 cursor-pointer hover:bg-gray-100 p-[5px] rounded-sm">
                    <PiCopySimpleLight size={20} />
                </button>
                <button className="text-gray-500 cursor-pointer hover:bg-gray-100 p-[5px] rounded-sm">
                    <CiTrash size={20} />
                </button>
            </div>
        </div>
    )
}

export default FormItem;
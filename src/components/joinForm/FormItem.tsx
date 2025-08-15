import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import DeleteIcon from "../../assets/icons/delete-icon.svg?react";
import GripIcon from "../../assets/icons/grip-icon.svg?react";
import PasteIcon from "../../assets/icons/paste-icon.svg?react";
import FieldOptions from "./FieldOptions";
import ToggleButton from "./ToggleButton";
import { useEffect, useRef, useState } from "react";

const FormItem = ({id, index}:{id:number, index:number}) => {
    const { attributes, setNodeRef, listeners, transform, transition } = useSortable({id});
    const [selectOption, setSelectOption] = useState<string>('객관식');
    const [title, setTitle] = useState<string>('');

    //title 길이 측정용 Ref
    const spanRef = useRef<HTMLSpanElement>(null);
    const [inputWidth, setInputWidth] = useState<number>(0);

    useEffect(()=>{
        if(spanRef.current){
            const spanWidth = spanRef.current.offsetWidth;
            setInputWidth(spanWidth);
        }
    },[title]);

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
            <div className="flex text-[22px] font-semibold mt-[24px] mb-[24px] border-b border-gray-100">
                <p>{index+1}.</p>
                <input 
                    className={`focus:outline-none focus:w-full max-w-full`} 
                    style={{width:`${inputWidth > 0 ? inputWidth : 10}px`}}
                    type="text" 
                    onChange={(e)=>setTitle(e.target.value)} />
                <span className="bg-gray-300 absolute" ref={spanRef} style={{visibility:'hidden'}}>
                    {title}
                </span>
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-[16px]">
                        <p className="text-[15px]">필수 입력</p>
                        <ToggleButton/>
                    </div>
                </div>
                <div>
                    <button className="text-gray-500 cursor-pointer hover:bg-gray-100 p-[5px] rounded-sm">
                        <PasteIcon  />
                    </button>
                    <button className="text-gray-500 cursor-pointer hover:bg-gray-100 p-[5px] rounded-sm">
                        <DeleteIcon  />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FormItem;
import PhoneIcon from "../../assets/icons/phone-icon.svg?react";
import TextIcon from "../../assets/icons/text-icon.svg?react";
import CheckBoxIcon from "../../assets/icons/checkbox-icon.svg?react";
import { useState } from "react";

type FieldOptions = {
    selectOption:string,
    handleOption: (option:string) => void
}

const options = [
    {name: '객관식' , icon: <CheckBoxIcon className="w-[18px]" />},
    {name: '전화번호' , icon: <PhoneIcon className="w-[18px]"/>},
    {name: '주관식' , icon: <TextIcon className="w-[18px]"/>},
]

const FieldOptions = ({selectOption, handleOption}:FieldOptions) => {
    const [isFocus, setIsFocus] = useState<boolean>(false);
    return(
        <div className="w-[335px]">
            <button
                className="flex items-center p-[12px] w-full text-gray-500 border-1 border-gray-200 rounded-xl gap-[12px]"
                onClick={()=>setIsFocus(true)}
                onBlur={()=>setIsFocus(false)}
            >   
                <div>{options.find((option)=>option.name===selectOption)?.icon}</div>
                <p>{selectOption}</p>
            </button>
            {
                isFocus && (
                <ul className="border-1 border-gray-200 rounded-xl p-[8px] mt-[8px]">
                {options.map((item)=>(
                    <li 
                    className={`${item.name === selectOption ? "bg-gray-100" : null} list-none flex items-center gap-[8px] rounded-xl text-black p-[12px] gap-[12px] cursor-pointer`}
                    onMouseDown={()=>handleOption(item.name)}
                    >
                        <div>{item.icon}</div>
                        <p>{item.name}</p>
                    </li>
                ))}
                </ul>
                )      
            }

        </div>
    )
}

export default FieldOptions;
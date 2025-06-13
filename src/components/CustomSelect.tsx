import { useState } from "react"
import { IoChevronDown } from "react-icons/io5";

type CustomSelectType = {
    options: string[]
}

const CustomSelect = ({options}:CustomSelectType) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<string>(options[0]);

    return(
        <div className="text-sm ml-[50px]">
            <button 
                className="flex items-center gap-[5px] cursor-pointer text-danuri-text"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}            
            >{selectedOption}<IoChevronDown size={20}/></button>
            {
                isDropdownOpen && (
                    <ul className="absolute border-1 border-gray-200 rounded-xl p-[10px] w-[300px] mt-[15px] bg-white">
                        {
                            options.map((item) => (
                                <li key={item} className={`${item === selectedOption ? 'bg-gray-100' : 'bg-white' } cursor-pointer p-[10px] rounded-lg`} onClick={()=>{setSelectedOption(item); setIsDropdownOpen(false)}}>{item}</li>
                            ))
                        }
                    </ul>
                )
            }
        </div>
    )
}

export default CustomSelect;
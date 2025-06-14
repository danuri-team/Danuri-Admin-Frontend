import { useRef, useState } from "react"
import { IoChevronDown } from "react-icons/io5";
import DatePicker from "react-datepicker";
import { ko } from 'date-fns/locale'

import "../style/DatePicker.css"
import "react-datepicker/dist/react-datepicker.css";

type CustomSelectType = {
    type: "select" | "date",
    options: string[]
}

const CustomSelect = ({type, options}:CustomSelectType) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<string>(options[0]);

    const [selectedDate, setSelectedDate] = useState<Date|null>(null);
    const datePickerRef = useRef<any>(null);

    const onBlurCloseDropdown = () => {
        //다른 곳 클릭 했을 때 드롭다운 닫기
        //드롭다운에서는 onClick이 아닌 onMouseDown을 사용해 blur보다 먼저 실행되도록 함
        setIsDropdownOpen(false)
    }

    return(
        <div className="text-sm ml-[50px]">
            {
                type === 'select' ? (
                    <>
                    <button 
                        className="flex items-center gap-[5px] cursor-pointer text-danuri-text"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        onBlur={onBlurCloseDropdown}            
                    >{selectedOption}<IoChevronDown size={20}/></button>
                    {
                        isDropdownOpen && (
                            <ul className="absolute border-1 border-gray-200 rounded-xl p-[10px] w-[300px] mt-[15px] bg-white">
                                {
                                    options.map((item) => (
                                        <li 
                                            key={item} 
                                            className={`${item === selectedOption ? 'bg-gray-100' : 'bg-white' } cursor-pointer p-[10px] rounded-lg`} 
                                            onMouseDown={()=>{setSelectedOption(item); setIsDropdownOpen(false)}}>{item}</li>
                                    ))
                                }
                            </ul>
                        )
                    }
                    </>
                ) : (
                    <div className="flex items-center text-danuri-text cursor-pointer">
                        <DatePicker 
                            ref={datePickerRef} 
                            className={`${selectedDate ? 'w-[80px]' : 'w-[60px]'} outline-none mr-[5px] placeholder:text-danuri-text transition-[width] duration-500 ease-in-out`}
                            calendarClassName="border-gray-100 bg-blue-100 rounded-xl"
                            placeholderText={options[0]} 
                            selected={selectedDate} 
                            locale={ko}
                            
                            onChange={(date) => {if(date)setSelectedDate(date)}} 
                            dateFormat={'yyyy-MM-dd'} />
                        <button onClick={()=>datePickerRef.current?.setOpen(true)}><IoChevronDown size={20}/></button>
                    </div>
                )
            }
        </div>
    )
}

export default CustomSelect;
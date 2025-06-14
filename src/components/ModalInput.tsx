import { ko } from "date-fns/locale";
import DatePicker from "react-datepicker"
import { IoCloseCircleSharp } from "react-icons/io5";

type ModalInputType = {
    label: string,
    type: "search" | 'date' | 'input',
    value: string | Date,
    resetValue: () => void,
    onChange: (value:string|Date) => void
}

const ModalInput = ({label, value, type, onChange, resetValue}: ModalInputType) => {

    return(
        <div className="text-sm mb-[15px]">
            <p className="mb-[5px]">{label}</p>
            {
                type === 'search' ? (
                    <div className="">
                        <input placeholder={`${label}을 검색해주세요`} type="text" value={value as string} onChange={(e)=>onChange(e.target.value)}/>
                        {
                            value && <button onClick={resetValue}><IoCloseCircleSharp /></button>
                        }
                    </div>
                ) :  type === 'date' ? (
                    <DatePicker 
                        className={`${value ? 'w-[80px]' : 'w-[60px]'} outline-none mr-[5px] placeholder:text-danuri-text transition-[width] duration-500 ease-in-out`}
                        calendarClassName="border-gray-100 bg-blue-100 rounded-xl"
                        placeholderText={`${label}을 선택해주세요.`} 
                        selected={value as Date} 
                        locale={ko}
                        
                        onChange={(date) => {if(date)onChange(date)}} 
                        dateFormat={'yyyy-MM-dd'}
                    />
                ) : (
                    <input className="w-full border-1 border-gray-200 rounded-xl p-[10px]" placeholder={`${label}을 입력해주세요.`} type={type} value={value as string} onChange={(e)=>onChange(e.target.value)}/>
                )
            }
        </div>
    )
}

export default ModalInput
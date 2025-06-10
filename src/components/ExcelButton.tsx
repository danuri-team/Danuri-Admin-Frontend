import { FiLayout } from "react-icons/fi";

const ExcelButton = () => {
    return(
        <button className="flex items-center text-danuri-text bg-danuri-100 p-[10px] text-sm rounded-md cursor-pointer">
            <FiLayout />
            <span className="ml-[10px]">다운로드</span>
        </button>
    )
}

export default ExcelButton;
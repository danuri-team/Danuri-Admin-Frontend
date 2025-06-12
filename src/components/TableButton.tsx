import { IoDocumentTextOutline } from "react-icons/io5";
import { CiSquarePlus } from "react-icons/ci";
import { IoIosSearch } from "react-icons/io";

type TableButtonType = {
    value:string,
    onClick?:() => void
}

const TableButton = ({value, onClick}:TableButtonType) => {
    return(
        <button 
            className="flex items-center bg-gray-100 p-[10px] pr-[15px] pl-[15px] text-sm rounded-xl cursor-pointer"
            onClick={onClick}
            >
            {
                value==="다운로드" ? (
                    <IoDocumentTextOutline size={20} />
                ) : value==="추가" ? (
                    <CiSquarePlus size={20} />
                ) : (
                    <IoIosSearch size={20} />
                )
            }
            <span className="ml-[8px]">{value}</span>
        </button>
    )
}

export default TableButton;
import type { Table } from "@tanstack/react-table";
import { useState } from "react";
import type { UsageData } from "./CustomTable";
import { IoCaretDownOutline } from "react-icons/io5";

const pageSizeOptions = [
    { value: 10 },
    { value: 50 },
    { value: 100 },
];

const PageSizeSelector = ({table}:{table:Table<UsageData>}) => {
    const [isopenPageSize, setIsOpenPageSize] = useState<boolean>(false);

    return(
        <div className="text-sm">
            <div className="flex items-center gap-[5px]">
                <button 
                    className="flex items-center gap-[5px] border-1 border-gray-200 rounded-md p-[3px] w-[40px] cursor-pointer" 
                    onClick={()=>setIsOpenPageSize(!isopenPageSize)}>
                    {table.getState().pagination.pageSize}
                    <IoCaretDownOutline size={10}/>
                </button>
                <span className="text-gray-500 text-xs">씩 보기</span>
            </div>
            {
                isopenPageSize && (
                    <ul className="absolute">
                        {
                            pageSizeOptions.map((option) => (
                                <li key={option.value} onClick={()=>table.setPageSize(option.value)}>{option.value}</li>
                            ) )
                        }
                    </ul>
                )
            }
        </div>
    )
}

export default PageSizeSelector;
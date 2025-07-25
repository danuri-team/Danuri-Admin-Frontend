import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";

type TargetProps = {
    isMust: boolean;
    label: string;
    value: string;
    onChange: () => void;
}

const targetBlock = {
    나이: ['10'],
    성별: ['남','여'],
    '현 공간 이용 여부': ['예', '아니오'],
    또는: null,
    그리고: null
}

const CampaignTarget = ({isMust,label, value, onChange}:TargetProps) => {
    const [tags, setTags] = useState<{key:string, value: string | null}[]>([]);

    return(
        <div className="mb-[20px]">
            <p className="text-danuri-text mb-[7px] font-semibold text-sm">{label}{isMust && <span className="text-red-400"> *</span>}</p>
            <div
                className={`border-gray-200 flex border rounded-xl p-[10px] w-full min-w-2xs min-h-[45px] overflow-x-scroll whitespace-nowrap`}
            >
                {
                    tags.map((tagObj)=>{
                        const key = Object.entries(tagObj)[0][1];
                        const value = Object.entries(tagObj)[1][1];

                        return (
                            <div 
                                className="flex text-sm rounded-sm mr-[10px] overflow-hidden">
                                <button
                                    className="cursor-pointer text-gray-500 bg-gray-100 p-[3px] pl-[10px] pr-[10px]"
                                    onClick={()=>setTags((prev)=>prev.filter((tag)=>tag.key !== key))}>
                                    {key}
                                </button>
                                {
                                    value && (
                                        <button
                                            className="cursor-pointer flex items-center gap-[3px] bg-blue-200 p-[3px] pl-[10px] pr-[10px]">
                                            {value}
                                            <IoChevronDown />
                                        </button>
                                    )
                                }
                            </div>
                        )
                    })
                }
                
            </div>
            <div className="flex mt-[15px]">
                {
                    Object.entries(targetBlock).map(([key, value])=>(
                        <button 
                            key={key} 
                            className="cursor-pointer text-sm text-gray-500 bg-gray-100 p-[3px] pl-[10px] pr-[10px] rounded-sm mr-[10px]"
                            onClick={()=>setTags((prev)=>{
                                const tempValue = value===null ? value : value[0];
                                return [...prev, {key, value:tempValue} ]
                            })}
                            >
                            {key}
                        </button>
                    ))
                }

            </div>
        </div>
    )
}

export default CampaignTarget;
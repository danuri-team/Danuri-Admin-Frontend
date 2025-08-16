const ToggleButton = ({handleToggle, isActive, type}: {handleToggle:(type:string,state:boolean)=>void, isActive:boolean, type:string}) => {
    return(
        <div className={`${isActive ? "bg-danuri-500" : "bg-gray-200"} flex relative w-[52px] h-[32px] rounded-full p-[4px]`}>
            <button className="cursor-pointer flex-1" onClick={()=>handleToggle(type,false)}></button>
            <button className="cursor-pointer flex-1" onClick={()=>handleToggle(type,true)}></button>
            <span className={`${isActive ? "translate-x-[20px]" : null} transition-all bg-white w-[24px] h-[24px] rounded-full absolute cursor-pointer`} onClick={()=>handleToggle(type,!isActive)}></span>
        </div>
    )
}

export default ToggleButton;
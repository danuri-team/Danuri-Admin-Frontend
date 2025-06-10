const CustomInput = ({label}:{label:string}) => {
    return(
        <div className="mb-[30px]">
            <p className="text-danuri-text mb-[10px]">{label}</p>
            <input className="outline-none border border-gray-200 bg-danuri-100 rounded-md p-[10px] w-[40%] min-w-xs" type="text" />
        </div>
    )
}

export default CustomInput;
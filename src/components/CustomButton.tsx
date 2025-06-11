type CustomButtonType = {
    value: string,
    onClick: () => void
}

const CustomButton = ({value, onClick}:CustomButtonType) => {
    return(
        <button className="rounded-md p-[10px] w-[40%] min-w-xs bg-danuri-400 text-white font-semibold mt-[40px] cursor-pointer" onClick={onClick}>
            {value}
        </button>
    )
}

export default CustomButton;
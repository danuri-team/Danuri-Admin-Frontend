type CustomButtonType = {
    value: string,
    onClick: () => void
}

const CustomButton = ({value, onClick}:CustomButtonType) => {
    return(
        <button className="rounded-xl p-[10px] w-full bg-danuri-500 text-white font-semibold cursor-pointer" onClick={onClick}>
            {value}
        </button>
    )
}

export default CustomButton;
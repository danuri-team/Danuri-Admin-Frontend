type CustomInputType = {
    placeholder?:string
    label: string,
    value: string,
    onChange: (e:React.ChangeEvent<HTMLInputElement>) => void
}

const CustomInput = ({placeholder, label, value, onChange}:CustomInputType) => {
    return(
        <div className="mb-[30px]">
            <p className="text-danuri-text mb-[10px]">{label}</p>
            <input 
                className="outline-none border border-gray-200 bg-danuri-100 rounded-md p-[10px] w-[40%] min-w-xs" 
                type={label==='비밀번호' ? 'password' : 'text'} 
                placeholder={placeholder} 
                value={value} 
                onChange={onChange} />
        </div>
    )
}

export default CustomInput;
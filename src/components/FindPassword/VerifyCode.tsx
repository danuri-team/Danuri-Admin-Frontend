import { useEffect, useState } from "react";
import CustomButton from "../CustomButton";
import CustomInput from "../CustomInput";
import { toast } from "react-toastify";

type VerifyCode = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClick: () => void
}

const VerifyCode = ({value, onChange, onClick}:VerifyCode) => {
    const [remainingTime, setRemainingTime] = useState<number>(30);

    useEffect(()=>{
        const viewTime = setInterval(()=>{
            setRemainingTime((prev)=>{
                if(prev <= 1){
                    clearInterval(viewTime);
                    return prev-1;
                }
                return prev-1;
            });
        },1000);

        const timer = setTimeout(()=>{
            toast.error('인증번호가 만료되었습니다.');
        },30000)

        return () => {
            clearTimeout(timer);
            clearInterval(viewTime);
        }
    },[])

    return(
        <div>
            <CustomInput 
                label="인증코드 입력"
                value={value}
                onChange={onChange}            
            />
            <div>
                <p className="text-red-400 text-xs">00:{String(remainingTime).padStart(2,'0')}</p>
            </div>
            <div className="mt-[60px]">
                <CustomButton value="확인" onClick={onClick} />
            </div>
        </div>
    )
}

export default VerifyCode;
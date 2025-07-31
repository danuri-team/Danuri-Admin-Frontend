import { isValidEmail } from "../../utils/infoValidation";
import CustomButton from "../CustomButton";
import CustomInput from "../CustomInput";

type EmailForFind = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClick: () => void;
}

const EmailForFindPassword = ({value, onChange, onClick}:EmailForFind) => {
    return(
        <div>
            <CustomInput 
                label="이메일"
                value={value}
                onChange={onChange}  
                valid={isValidEmail(value)}          
            />
            <div className="mt-[60px]">
                <CustomButton value="다음" onClick={onClick} />
            </div>
        </div>
    )
}

export default EmailForFindPassword;
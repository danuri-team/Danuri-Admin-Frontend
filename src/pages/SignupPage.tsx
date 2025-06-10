//company_id, email, password, phone
import { useReducer } from "react";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { Link } from "react-router-dom";

type SignupState = {
    company_id: string,
    email: string,
    password:string,
    phone: string
}

type SignupAction = 
    | {type: 'CHANGE', payload: {key:string, value: string}}
    | {type: 'RESET'};

const initialSignupForm:SignupState = {
    company_id: '',
    email: '',
    password: '',
    phone: ''
}

const signupReducer = (state:SignupState, action:SignupAction) => {
    switch(action.type){
        case 'CHANGE':
            console.log(state);
            return {
                ...state,
                [action.payload.key]: action.payload.value
            }
        case 'RESET':
            return initialSignupForm;
    }
}

const SignupPage = () => {
    const [SignupForm, dispatch] = useReducer(signupReducer, initialSignupForm);
    
    const loginInputs = [
        {label:'회사ID', key: 'company_id', value: SignupForm.company_id},
        {label:'이메일', key: 'email', value: SignupForm.email},
        {label:'비밀번호', key: 'password', value: SignupForm.password},
        {label:'전화번호', key: 'phone', value: SignupForm.phone},
    ]

    const onclickLogin = () => {
        
    }

    return(
        <div className="w-full h-screen flex">
            <div className="m-auto">
                <h1 className="text-2xl font-bold  mb-[50px]">회원가입</h1>
                {
                    loginInputs.map((item) => (
                        <CustomInput label={item.label} key={item.key} value={item.value} onChange={(e)=>dispatch({type:'CHANGE', payload:{key:item.key, value:e.target.value}})} />
                    ))
                }
                <div className="justify-self-end text-xs text-danuri-400 cursor-pointer underline">
                    <Link to={'/auth/login'}>로그인</Link>
                </div>
                <CustomButton value="회원가입" onClick={()=>onclickLogin}/>
            </div>
        </div>
    )
}

export default SignupPage;
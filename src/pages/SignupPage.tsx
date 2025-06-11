//company_id, email, password, phone
import { useReducer } from "react";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { Link, useNavigate } from "react-router-dom";
import { postSignup } from "../api/AuthAPI";

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
    const navigate = useNavigate();
    const [signupForm, dispatch] = useReducer(signupReducer, initialSignupForm);
    
    const loginInputs = [
        {label:'회사ID', key: 'company_id', value: signupForm.company_id},
        {label:'이메일', key: 'email', value: signupForm.email},
        {label:'비밀번호', key: 'password', value: signupForm.password},
        {label:'전화번호', key: 'phone', value: signupForm.phone},
    ]

    const onclickSignup = async () => {
        console.log('실행');

        const res = await postSignup({
            company_id: signupForm.company_id, 
            email: signupForm.email, 
            password:signupForm.password, 
            phone: signupForm.phone })
        
        if(res.pass){
            dispatch({type:'RESET'})
            navigate('/auth/login');
        }
        else {
            console.log('회원가입 실패', res.data);
        }
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
                <CustomButton value="회원가입" onClick={()=>onclickSignup}/>
            </div>
        </div>
    )
}

export default SignupPage;
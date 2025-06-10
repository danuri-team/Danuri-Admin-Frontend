//email, password
import { useReducer } from "react";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { Link } from "react-router-dom";

type LoginState = {
    email: string,
    password:string
}

type LoginAction = 
    | {type: 'CHANGE', payload: {key:string, value: string}}
    | {type: 'RESET'};

const initialLoginForm:LoginState = {
    email: '',
    password: ''
}

const loginReducer = (state:LoginState, action:LoginAction) => {
    switch(action.type){
        case 'CHANGE':
            console.log(state);
            return {
                ...state,
                [action.payload.key]: action.payload.value
            }
        case 'RESET':
            return initialLoginForm;
    }
}


const LoginPage = () => {
    const [loginForm, dispatch] = useReducer(loginReducer, initialLoginForm);
    
    const loginInputs = [
        {label:'이메일', key: 'email', value: loginForm.email},
        {label:'비밀번호', key: 'password', value: loginForm.password},
    ]

    const onclickLogin = () => {
        
    }

    return(
        <div className="w-full h-screen flex">
            <div className="m-auto">
                <h1 className="text-2xl font-bold  mb-[50px]">로그인</h1>
                {
                    loginInputs.map((item) => (
                        <CustomInput label={item.label} key={item.key} value={item.value} onChange={(e)=>dispatch({type:'CHANGE', payload:{key:item.key, value:e.target.value}})} />
                    ))
                }
                <div className="justify-self-end text-xs text-danuri-400 cursor-pointer underline">
                    <Link to={'/auth/signup'}>회원가입</Link>
                </div>
                <CustomButton value="로그인" onClick={()=>onclickLogin}/>
            </div>
        </div>
    )
}

export default LoginPage;
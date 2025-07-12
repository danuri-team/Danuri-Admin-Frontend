import { useReducer, useState } from "react";
import { GoChevronLeft } from "react-icons/go";
import { Link } from "react-router-dom";
import EmailForFindPassword from "../components/EmailForFindPassword";
import VerifyCode from "../components/VerifyCode";
import { toast } from "react-toastify";
import { isValidEmail } from "../utils/infoValidation";

type FindPasswordState = {
  email: string;
  code: string;
};

type FindPasswordAction = { type: "CHANGE"; payload: { key: string; value: string } } | { type: "RESET" };

const initialFindForm: FindPasswordState = {
  email: "",
  code: "",
};

const findReducer = (state: FindPasswordState, action: FindPasswordAction) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    case "RESET":
      return initialFindForm;
  }
};


const FindPassword = () => {
  const [findForm, dispatch] = useReducer(findReducer, initialFindForm);
  const [isNext, setIsNext] = useState<boolean>(false);

  const onClickSendEmail = () => {
    if(findForm.email===""){
      toast.error('이메일을 입력해주세요.');
      return;
    }
    if (!isValidEmail(findForm.email)){
      toast.error('이메일이 형식에 맞지않습니다.');
      return;
    }
    //api 연결
    const a = true
    if(a){//성공
      toast.success('인증번호가 전송되었습니다.');
      setIsNext(true);
    }
    else{//실패
      toast.error('인증번호 전송에 실패했습니다.')
    }

  }

  const onClickVerifyCode = () => {
    if(findForm.code.length < 6){
      toast.error('인증번호는 6자리입니다.');
      return;
    }
    //api 연경
    const b = true;
    if(b){
      toast.success('이메일이 인증되었습니다.');
    }
    else{
      toast.error('인증에 실패했습니다.');
    }

  }



  return(
    <div className="w-full h-screen flex">
      <div className="m-auto w-[50%] min-w-xs max-w-md">
        <Link to={'/auth/login'}><GoChevronLeft size={30} /></Link>
        <h1 className="justify-self-center text-3xl font-bold mb-[50px]">비밀번호 찾기</h1>
        {
          !isNext ? 
            <EmailForFindPassword 
              value={findForm.email} 
              onChange={(e)=>dispatch({type:'CHANGE', payload: {key:'email', value: e.target.value}})}
              onClick={onClickSendEmail} /> 
          : <VerifyCode
              value={findForm.code}
              onChange={(e)=>dispatch({type:'CHANGE', payload: {key:'code', value: e.target.value}})} 
              onClick={onClickVerifyCode}/>
        }
        
        <div className="w-[200px] flex items-center justify-between justify-self-center mt-[30px]">
          <Link className="w-[80px] text-sm text-gray-400 cursor-pointer" to={"/auth/password"}>비밀번호 찾기</Link>
          <div className="w-[1px] h-[20px] border-l-1 border-gray-300"></div>
          <Link className="w-[80px] text-sm text-gray-400 cursor-pointer" to={"/auth/signup"}>회원가입</Link>
        </div>
      </div>
    </div>
  )
}

export default FindPassword;
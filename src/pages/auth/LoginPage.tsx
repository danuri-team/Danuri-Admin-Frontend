//email, password
import { useReducer } from "react";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../redux/reducers/authSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { toast } from 'react-toastify';

type LoginState = {
  email: string;
  password: string;
};

type LoginAction = { type: "CHANGE"; payload: { key: string; value: string } } | { type: "RESET" };

const initialLoginForm: LoginState = {
  email: "",
  password: "",
};

const loginReducer = (state: LoginState, action: LoginAction) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    case "RESET":
      return initialLoginForm;
  }
};

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [loginForm, loginDispatch] = useReducer(loginReducer, initialLoginForm);

  const loginInputs = [
    { label: "이메일", key: "email", value: loginForm.email },
    { label: "비밀번호", key: "password", value: loginForm.password },
  ];

  const onclickLogin = async () => {
    if (Object.values(loginForm).includes("")){
      toast.error('모든 항목을 입력해주세요.');
      return;
    }
    try{
      await dispatch(login({ email: loginForm.email, password: loginForm.password })).unwrap();
      
      toast.success('로그인되었습니다.')
      loginDispatch({ type: "RESET" });

      navigate("/usage");
    }
    catch {
      toast.error('로그인에 실패했습니다.')
    }
  };

  return (
    <div className="w-full h-screen flex">
      <div className="m-auto w-[50%] min-w-xs max-w-md">
        <h1 className="justify-self-center text-3xl font-bold mb-[50px]">다누리</h1>
        {loginInputs.map((item) => (
          <CustomInput
            label={item.label}
            key={item.key}
            value={item.value}
            onChange={(e) =>
              loginDispatch({ type: "CHANGE", payload: { key: item.key, value: e.target.value } })
            }
          />
        ))}
        <div className="mt-[60px]">
          <CustomButton value="로그인" onClick={onclickLogin} />
        </div>
        <div className="w-[200px] flex items-center justify-between justify-self-center mt-[30px]">
          <Link className="w-[80px] text-sm text-gray-400 cursor-pointer" to={"/auth/password"}>비밀번호 찾기</Link>
          <div className="w-[1px] h-[20px] border-l-1 border-gray-300"></div>
          <Link className="w-[80px] text-sm text-gray-400 cursor-pointer" to={"/auth/signup"}>회원가입</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

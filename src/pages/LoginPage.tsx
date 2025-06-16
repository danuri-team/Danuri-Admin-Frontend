//email, password
import { useReducer } from "react";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../redux/reducers/authSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";

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
      console.log(state);
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
    console.log("실행");
    //POST
    //pass가 true인 경우 폼 리셋 후 경로 이동
    loginDispatch({ type: "RESET" });
    dispatch(login({ email: loginForm.email, password: loginForm.password }));
    navigate("/usage");
  };

  return (
    <div className="w-full h-screen flex">
      <div className="m-auto">
        <h1 className="text-2xl font-bold  mb-[50px]">로그인</h1>
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
        <div className="justify-self-end text-xs text-danuri-400 cursor-pointer underline">
          <Link to={"/auth/signup"}>회원가입</Link>
        </div>
        <CustomButton value="로그인" onClick={onclickLogin} />
      </div>
    </div>
  );
};

export default LoginPage;

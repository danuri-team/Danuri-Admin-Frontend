import { useReducer, useCallback } from "react";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

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
  const { login } = useAuth();

  const [loginForm, loginDispatch] = useReducer(loginReducer, initialLoginForm);

  const onclickLogin = useCallback(async () => {
    if (Object.values(loginForm).includes("")) {
      toast.error("모든 항목을 입력해주세요.");
      return;
    }
    try {
      await login(loginForm.email, loginForm.password);

      toast.success("로그인되었습니다.");
      loginDispatch({ type: "RESET" });

      navigate("/usage");
    } catch {
      toast.error("로그인에 실패했습니다.");
    }
  }, [loginForm, login, navigate]);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    loginDispatch({ type: "CHANGE", payload: { key: "email", value: e.target.value } });
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    loginDispatch({ type: "CHANGE", payload: { key: "password", value: e.target.value } });
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onclickLogin();
    },
    [onclickLogin]
  );

  return (
    <div className="w-full h-screen flex">
      <form onSubmit={handleSubmit} className="m-auto w-[50%] min-w-xs max-w-lg">
        <h1 className="justify-self-center text-4xl font-bold mb-[50px]">다누리</h1>
        <div className="flex flex-col gap-[24px]">
          <CustomInput
            label="이메일"
            key="email"
            value={loginForm.email}
            onChange={handleEmailChange}
            autoComplete="email"
          />
          <CustomInput
            label="비밀번호"
            key="password"
            value={loginForm.password}
            onChange={handlePasswordChange}
            autoComplete="current-password"
          />
        </div>
        <div className="mt-[60px]">
          <CustomButton value="로그인" onClick={() => {}} type="submit" />
        </div>
        <div className="w-[200px] flex items-center justify-between justify-self-center mt-[30px]"></div>
      </form>
    </div>
  );
};

export default LoginPage;

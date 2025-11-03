//company_id, email, password, phone
import { useReducer } from "react";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import { Link, useNavigate } from "react-router-dom";
import { postSignup } from "@/services/api/AuthAPI";
import { isValidEmail } from "@/utils/infoValidation";
import { replacePhone } from "@/utils/format/infoFormat";
import { GoChevronLeft } from "react-icons/go";
import { toast } from "react-toastify";

type SignupState = {
  companyId: string;
  email: string;
  phone: string;
  password: string;
  rePassword: string;
};

type SignupAction = { type: "CHANGE"; payload: { key: string; value: string } } | { type: "RESET" };

const initialSignupForm: SignupState = {
  companyId: "",
  email: "",
  phone: "",
  password: "",
  rePassword: "",
};

const signupReducer = (state: SignupState, action: SignupAction) => {
  switch (action.type) {
    case "CHANGE":
      if (action.payload.key === "phone") {
        return {
          ...state,
          [action.payload.key]: replacePhone(action.payload.value),
        };
      }
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    case "RESET":
      return initialSignupForm;
  }
};

const SignupPage = () => {
  const navigate = useNavigate();
  const [signupForm, dispatch] = useReducer(signupReducer, initialSignupForm);

  const loginInputs = [
    { label: "회사", key: "companyId", type: "search", value: signupForm.companyId },
    { label: "이메일", key: "email", value: signupForm.email },
    { label: "전화번호", key: "email", value: signupForm.phone },
    { label: "비밀번호", key: "password", value: signupForm.password },
    { label: "비밀번호 확인", key: "rePassword", value: signupForm.rePassword },
  ];

  const onclickSignup = async () => {
    if (Object.values(signupForm).includes("")) {
      toast.error("모든 항목을 입력해주세요.");
      return;
    }
    if (!isValidEmail(signupForm.email)) {
      toast.error("이메일이 형식에 맞지않습니다.");
      return;
    }

    const res = await postSignup({
      companyId: signupForm.companyId,
      email: signupForm.email,
      phone: signupForm.phone,
      password: signupForm.password,
      rePassword: signupForm.rePassword,
    });

    if (res.pass) {
      toast.success("회원가입되었습니다.");
      dispatch({ type: "RESET" });
      navigate("/auth/login");
    } else {
      toast.error("회원가입에 실패했습니다.");
    }
  };

  return (
    <div className="w-full h-screen flex">
      <div className="m-auto w-[50%] min-w-xs max-w-lg pt-[50px] pb-[50px]">
        <Link to={"/auth/login"}>
          <GoChevronLeft size={30} />
        </Link>
        <h1 className="justify-self-center text-4xl font-bold mb-[50px] mt-[36px]">회원가입</h1>
        <div className="flex flex-col gap-[24px]">
          {loginInputs.map((item) => (
            <CustomInput
              type={item.type}
              label={item.label}
              key={item.key}
              value={item.value}
              valid={item.key === "email" ? isValidEmail(signupForm.email) : undefined}
              onChange={(e) =>
                dispatch({ type: "CHANGE", payload: { key: item.key, value: e.target.value } })
              }
            />
          ))}
        </div>
        <div className="mt-[60px]">
          <CustomButton value="완료" onClick={() => onclickSignup()} />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

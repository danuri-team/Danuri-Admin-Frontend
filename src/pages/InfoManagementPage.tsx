//import CustomInput from "../components/CustomInput";
import { useReducer } from "react";
import BannerButton from "../components/BannerButton";
import CustomInput from "../components/CustomInput";
import MainHeader from "../components/MainHeader";
import { isValidEmail } from "../utils/infoValidation";
import CustomButton from "../components/CustomButton";

type InfoAction = { type: "CHANGE"; payload: { key: string; value: string } } | { type: "RESET" };

type InfoState = {
  company: string;
  email: string;
  phone: string;
};

const initialInfoForm: InfoState = {
  company: "",
  email: "",
  phone: "",
};

const infoReducer = (state: InfoState, action: InfoAction) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    case "RESET":
      return initialInfoForm;
  }
};

const InfoManagementPage = () => {
  const [infoForm, infoDispatch] = useReducer(infoReducer, initialInfoForm);

  const onClickSubmitInfo = () => {};

  return (
    <div className="w-full">
      <MainHeader />
      <BannerButton />
      <div className="flex-1 mr-[50px] ml-[50px] text-nowrap">
        <div className="mb-[30px] flex">
          <h1 className="text-xl font-bold">정보 관리</h1>
        </div>
        <div className="w-sm">
          <CustomInput
            label="회사"
            value={infoForm.company}
            onChange={(e) =>
              infoDispatch({ type: "CHANGE", payload: { key: "company", value: e.target.value } })
            }
          />
          <CustomInput
            label="이메일"
            value={infoForm.email}
            valid={isValidEmail(infoForm.email)}
            onChange={(e) =>
              infoDispatch({ type: "CHANGE", payload: { key: "email", value: e.target.value } })
            }
          />
          <CustomInput
            label="전화번호"
            value={infoForm.phone}
            valid={isValidEmail(infoForm.phone)}
            onChange={(e) =>
              infoDispatch({ type: "CHANGE", payload: { key: "phone", value: e.target.value } })
            }
          />
        </div>
        <div className="w-[150px] mt-[60px]">
          <CustomButton value="저장하기" onClick={() => onClickSubmitInfo} />
        </div>
      </div>
    </div>
  );
};

export default InfoManagementPage;

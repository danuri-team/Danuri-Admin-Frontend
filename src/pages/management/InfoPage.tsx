//import CustomInput from "../components/CustomInput";
import { useEffect, useReducer, useState } from "react";
import BannerButton from "@/components/BannerButton";
import CustomInput from "@/components/CustomInput";
import MainHeader from "@/components/MainHeader";
import { isValidEmail, isValidPhone } from "@/utils/infoValidation";
import CustomButton from "@/components/CustomButton";
import { replacePhone } from "@/utils/format/infoFormat";
import { getMyInfo, putAdminInfo } from "@/services/api/AdminAPI";

type InfoAction = { type: "CHANGE"; payload: { key: string; value: string } } | { type: "RESET" };

type InfoState = {
  id: string;
  company_name: string;
  email: string;
  phone: string;
  role: string;
};

const initialInfoForm: InfoState = {
  id: "",
  company_name: "",
  email: "",
  phone: "",
  role: "ROLE_ADMIN",
};

const infoReducer = (state: InfoState, action: InfoAction) => {
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
      return initialInfoForm;
  }
};

const InfoPage = () => {
  const [isChangeData, setIsChangeData] = useState<boolean>(false);
  const [infoForm, infoDispatch] = useReducer(infoReducer, initialInfoForm);

  useEffect(() => {
    if (isChangeData) setIsChangeData(false);
    const getInfoData = async () => {
      const res = await getMyInfo();
      if (res.pass) {
        infoDispatch({ type: "CHANGE", payload: { key: "id", value: res.data.id } });
        infoDispatch({
          type: "CHANGE",
          payload: { key: "company_name", value: res.data.company_name },
        });
        infoDispatch({ type: "CHANGE", payload: { key: "email", value: res.data.email } });
        infoDispatch({ type: "CHANGE", payload: { key: "phone", value: res.data.phone } });
      }
    };
    getInfoData();
  }, [isChangeData]);

  const onClickSubmitInfo = async () => {
    if (!isValidEmail(infoForm.email) || !isValidPhone(infoForm.phone)) {
      return;
    }

    const res = await putAdminInfo({
      id: infoForm.id as string,
      email: infoForm.email as string,
      phone: infoForm.phone,
      role: infoForm.role,
    });
    if (res.pass) {
      setIsChangeData(true);
    }
  };

  return (
    <div className="w-full">
      <MainHeader />
      <BannerButton />
      <div className="flex-1 max-w-360 justify-self-center mr-[50px] ml-[50px] text-nowrap">
        <div className="mb-[30px] flex">
          <h1 className="text-xl font-bold">정보 관리</h1>
        </div>
        <div className="w-sm flex flex-col gap-[30px]">
          {/* <CustomInput
            label="회사"
            value={infoForm.company_name}
            onChange={(e) =>
              infoDispatch({
                type: "CHANGE",
                payload: { key: "company_name", value: e.target.value },
              })
            }
            disabled={true}
          /> */}
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
            valid={isValidPhone(infoForm.phone)}
            onChange={(e) =>
              infoDispatch({ type: "CHANGE", payload: { key: "phone", value: e.target.value } })
            }
          />
        </div>
        <div className="w-[150px] mt-[60px]">
          <CustomButton value="저장하기" onClick={() => onClickSubmitInfo()} />
        </div>
      </div>
    </div>
  );
};

export default InfoPage;

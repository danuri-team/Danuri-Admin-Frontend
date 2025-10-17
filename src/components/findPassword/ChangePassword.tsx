import CustomButton from "../CustomButton";
import CustomInput from "../CustomInput";

type changePassword = {
  value: { new: string; re: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>, key: string) => void;
  onClick: () => void;
};

const ChangePassword = ({ value, onChange, onClick }: changePassword) => {
  return (
    <div>
      <div className="flex flex-col gap-[24px]">
        <CustomInput
          label="새 비밀번호"
          value={value.new}
          onChange={(e) => onChange(e, "newPassword")}
        />
        <CustomInput
          label="비밀번호 확인"
          value={value.re}
          onChange={(e) => onChange(e, "rePassword")}
        />
      </div>
      <div className="mt-[60px]">
        <CustomButton value="확인" onClick={onClick} />
      </div>
    </div>
  );
};

export default ChangePassword;

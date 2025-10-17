import BannerButton from "../../components/BannerButton";
import CampaignTarget from "../../components/CampaignTarget";
import CustomDetail from "../../components/CustomDetail";
import CustomInput from "../../components/CustomInput";
import MainHeader from "../../components/MainHeader";
import ViewKakaoTalk from "../../components/ViewKakaoTalk";

const CampaignManagementPage = () => {
  return (
    <div className="w-full">
      <MainHeader />
      <BannerButton />
      <div className="flex-1 max-w-360 justify-self-center mr-[50px] ml-[50px] text-nowrap">
        <div className="mr-[20px] ml-[20px] mb-[30px] flex justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">캠페인 관리</h1>
          </div>
        </div>
        <div className="flex mr-[50px] ml-[50px] mb-[50px]">
          <ViewKakaoTalk />
          <div className="ml-[10%] lg:ml-[110px] mt-[30px] flex-1 ">
            <div className="max-w-sm">
              <CustomInput isMust type="" label="캠페인 이름" value="" onChange={() => {}} />
              <CampaignTarget isMust label="캠페인 대상" value="" onChange={() => {}} />
              <CustomInput isMust label="시작 시간" type="time" value={null} onChange={() => {}} />
            </div>
            <CustomDetail isMust label="캠페인 내용" value="" onChange={() => {}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignManagementPage;

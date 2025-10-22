import BannerButton from "@/components/BannerButton";
import BorderSelect from "@/components/BorderSelect";
import CustomDetail from "@/components/CustomDetail";
import MainHeader from "@/components/MainHeader";
import ViewKakaoTalk from "@/components/ViewKakaoTalk";

const NotiTalkPage = () => {
  return (
    <div className="w-full">
      <MainHeader />
      <BannerButton />
      <div className="flex-1 max-w-360 justify-self-center mr-[50px] ml-[50px] text-nowrap">
        <div className="mr-[20px] ml-[20px] mb-[30px] flex justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">알림톡 템플릿 관리</h1>
          </div>
        </div>
        <div className="flex mr-[50px] ml-[50px] mb-[50px]">
          <ViewKakaoTalk />
          <div className="ml-[10%] lg:ml-[110px] mt-[30px] flex-1 ">
            <div className="max-w-sm">
              <BorderSelect label="타입" value="공간 이용 등록 시" />
            </div>
            <CustomDetail isMust label="캠페인 내용" value="" onChange={() => {}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotiTalkPage;

import statusBar from "../assets/phone-status-bar.png";
import homeBar from "../assets/phone-home-bar.png";

const mockText = `🏖️ 방학엔 미리미리! 인기 공간, 지금 선점하세요 🗓️

다가오는 방학, 인기 공간은 금방 마감됩니다! 지금 선예약하시면 우선 이용권 + 특별 혜택까지!
📅 캠페인 기간: ~ 7월 31일까지

🎁 선예약 혜택:
- 우선 예약 보장
- 추가 이용 시간 1시간 무료
- 추첨을 통해 소정의 선물 제공

지금 바로 예약하고 여유로운 방학 계획을 시작하세요!`;

const ViewKakaoTalk = () => {
  return (
    <div className="min-w-[360px] w-[360px] h-[740px] bg-[#CAD5DD]">
      <div className="absolute z-0">
        <img src={statusBar} alt="상태바" className="min-w-[360px] w-[360px]" />
      </div>
      <div className="m-[30px] mt-[100px] flex">
        <div className="min-w-[40px] w-[40px] h-[40px] rounded-xl bg-white"></div>
        <div className="ml-[10px] mt-[3px]">
          <p className="text-sm font-light mb-[3px]">다누리</p>
          <div className="font-medium max-w-[230px] w-[230px] rounded-xl overflow-hidden">
            <p className="text-md bg-[#FDE500] p-[12px]">알림톡 도착</p>
            <p className="bg-white p-[12px] whitespace-pre-line text-sm">{mockText}</p>
          </div>
        </div>
      </div>
      <div className="absolute mt-[700px] z-0">
        <img src={homeBar} alt="홈바" className="min-w-[360px] w-[360px]" />
      </div>
    </div>
  );
};

export default ViewKakaoTalk;

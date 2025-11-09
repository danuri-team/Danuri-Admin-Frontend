import { memo, useCallback } from "react";
import announceIcon from "../assets/icons/announce-icon.png";

const FEEDBACK_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdI9roa083JuemMBXG8gYZj51QCcG7jwm0VzV1J026vqEZTyw/viewform?usp=dialog";

const BannerButton = memo(() => {
  const handleClick = useCallback(() => {
    window.open(FEEDBACK_URL);
  }, []);

  return (
    <button
      className="flex items-center bg-gray-100 rounded-xl w-[400px] p-[10px] justify-center mt-[40px] mb-[40px] justify-self-center cursor-pointer hover:bg-gray-200 transition-colors"
      onClick={handleClick}
      aria-label="버그 제보 및 피드백 폼 열기"
    >
      <img src={announceIcon} alt="공지" />
      <span className="text-sm font-semibold ml-[10px]">
        버그 제보 혹은 피드백은 여기에 남겨주세요 ↗
      </span>
    </button>
  );
});

BannerButton.displayName = "BannerButton";

export default BannerButton;

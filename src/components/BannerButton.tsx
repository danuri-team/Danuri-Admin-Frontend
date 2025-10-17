import announceIcon from "../assets/icons/announce-icon.png";

const BannerButton = () => {
  return (
    <button
      className="flex items-center bg-gray-100 rounded-xl w-[400px] p-[10px] justify-center mt-[40px] mb-[40px] justify-self-center cursor-pointer"
      onClick={() =>
        window.open(
          "https://docs.google.com/forms/d/e/1FAIpQLSdI9roa083JuemMBXG8gYZj51QCcG7jwm0VzV1J026vqEZTyw/viewform?usp=dialog"
        )
      }
    >
      <img src={announceIcon} alt="공지" />
      <span className="text-sm font-semibold ml-[10px]">
        버그 제보 혹은 피드백은 여기에 남겨주세요 ↗
      </span>
    </button>
  );
};

export default BannerButton;

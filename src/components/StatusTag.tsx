const valueChange: Record<string, { text: string; color: string }> = {
  NOT_AVAILABLE: { text: "이용불가", color: "red" },
  AVAILABLE: { text: "이용가능", color: "blue" },
  USE: { text: "이용중", color: "blue" },
  NOT_USE: { text: "종료됨", color: "gray" },
  NOT_CONFIRMED: { text: "미확인", color: "red" },
  RETURNED: { text: "반납됨", color: "gray" },
  IN_USE: { text: "이용중", color: "blue" },
};

const getColorClass = (color: string) => {
  const colorClasses: Record<string, string> = {
    gray: "text-danuri-text bg-gray-100",
    blue: "text-[#0098B2] bg-[#d7edf3]",
    red: "text-red-500 bg-red-100",
  };
  return colorClasses[color] || colorClasses.red;
};

const StatusTag = ({ value }: { value: string }) => {
  const statusInfo = valueChange[value];
  const color = getColorClass(statusInfo.color);

  if (!statusInfo) {
    return (
      <div
        className={`text-danuri-text bg-gray-100 flex text-[12px] rounded-md w-fit p-[3px] items-center`}
      >
        알 수 없음
      </div>
    );
  }

  return (
    <div
      className={`${color} flex text-[12px] rounded-md min-w-[44px] w-fit h-[20px] p-[6px] items-center`}
    >
      {valueChange[value].text}
    </div>
  );
};

export default StatusTag;

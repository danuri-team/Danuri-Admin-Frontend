const valueChange: Record<string, string> = {
  NOT_AVAILABLE: "이용불가",
  AVAILABLE: "이용가능",
  USE: "이용중",
  NOT_USE: "종료됨",
  NOT_CONFIRMED: "미확인",
  RETURNED: "반납됨",
  IN_USE: "이용중",
};

//수정사항: Figma 디자인에 맞게 태그 색 수정
const StatusTag = ({ value }: { value: string }) => {
  return (
    <div
      className={`${value.includes("NOT") ? "text-danuri-text bg-gray-100" : "text-danuri-400 bg-danuri-200"} text-xs rounded-sm w-fit p-[2px]`}
    >
      {valueChange[value]}
    </div>
  );
};

export default StatusTag;

const valueChange: Record<string, {text:string, color: string}> = {
  NOT_AVAILABLE: {text: "이용불가", color: 'red'},
  AVAILABLE: {text:"이용가능", color: 'blue'},
  USE: {text: "이용중", color: 'blue'},
  NOT_USE: {text: "종료됨", color: 'gray'},
  NOT_CONFIRMED: {text: "미확인", color: 'red'},
  RETURNED: {text: "반납됨", color: 'gray'},
  IN_USE: {text: "이용중", color: 'blue'},
};

const StatusTag = ({ value }: { value: string }) => {
  return (
    <div
      className={`${valueChange[value].color === 'gray' ? "text-danuri-text bg-gray-100" : valueChange[value].color === 'blue' ? "text-danuri-400 bg-danuri-200" : 'text-red-500 bg-red-100'} flex text-[10px] rounded-md w-fit p-[3px] items-center`}
    >
      {valueChange[value].text}
    </div>
  );
};

export default StatusTag;

import { useState, type ChangeEvent } from "react";

type DetailProps = {
    isMust?:boolean;
    label:string,
    value: string,
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

const mockText = `🏖️ 방학엔 미리미리! 인기 공간, 지금 선점하세요 🗓️

다가오는 방학, 인기 공간은 금방 마감됩니다! 지금 선예약하시면 우선 이용권 + 특별 혜택까지!
📅 캠페인 기간: ~ 7월 31일까지

🎁 선예약 혜택:
- 우선 예약 보장
- 추가 이용 시간 1시간 무료
- 추첨을 통해 소정의 선물 제공

지금 바로 예약하고 여유로운 방학 계획을 시작하세요!`

const CustomDetail = ({isMust, label, value, onChange}:DetailProps) => {
    const [isFocus, setIsFocus] = useState<boolean>(false);
    
    return(
      <div className="mb-[20px]">
        <p className="text-danuri-text mb-[7px] font-semibold text-sm">{label}{isMust && <span className="text-red-400"> *</span>}</p>
        <div className={`${isFocus ? "border-blue-400" : "border-gray-200"} border-1 rounded-xl p-[10px] min-w-2xs max-w-2xl`}>
          <textarea 
            className={`outline-none resize-none placeholder:text-gray-300 w-full text-sm`}
            rows={13}
            cols={50}
            maxLength={2000}
            value={mockText}
            onChange={onChange}
            onFocus={()=>setIsFocus(true)}
            onBlur={()=>setIsFocus(false)}/>
          <p className="text-sm text-gray-400">{mockText.length}/2000</p>
        </div>
      </div>
    )
}

export default CustomDetail;
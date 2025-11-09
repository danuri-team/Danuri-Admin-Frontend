import type { ModalInputTypesType } from "@/types/modal";
import type { ReactElement } from "react";
import { IoCloseCircleSharp } from "react-icons/io5";

interface RenderModalInputsProps {
  qrSrc?: string;
  qrCode?: string;
  label?: string;
  disabled?: boolean;
  isFocus?: boolean;
  searchInput?: string;
  value?: string;
  searchTerms?: { name: string; value: string }[];
}

export const RenderModalInputs: Partial<
  Record<ModalInputTypesType, (props: RenderModalInputsProps) => ReactElement>
> = {
  image: ({ qrSrc, qrCode }) => {
    const isExistQr = qrSrc && qrCode;
    return (
      <div className="min-h-[250px] text-center  justify-self-center">
        <div className="h-[303px]">
          {isExistQr ? (
            <>
              <div className="w-[290px] h-[270px] overflow-hidden object-cover flex items-center">
                <img src={qrSrc} alt="QRCode" className="w-[400px] h-[400px] object-cover" />
              </div>
              <p className="text-[14px] mt-[12px]">{qrCode}</p>
            </>
          ) : (
            <>
              <div className="animate-pulse w-[270px] h-[270px] bg-gray-200 rounded-[8px]"></div>
              <p className="bg-gray-200 w-[80px] h-[14px] mt-[12px] rounded-[8px] justify-self-center"></p>
            </>
          )}
        </div>
      </div>
    );
  },
  search: ({ label, isFocus, disabled, searchInput, value, searchTerms }) => (
    <div className="text-sm mb-[15px]">
      <p className="mb-[5px]">{label}</p>
      <div className="relative">
        <div
          className={`${isFocus ? "border-blue-400" : "border-gray-200"} flex items-center w-full border-1 rounded-xl p-[12px]`}
        >
          <input
            disabled={disabled}
            className="w-full outline-none"
            placeholder={`${label}을 검색해주세요`}
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
          />
          {value && (
            <button className="text-gray-300 cursor-pointer" onClick={resetValue}>
              <IoCloseCircleSharp size={16} />
            </button>
          )}
        </div>
        {
          //검색어가 한 개도 없고, 입력박스에 포커싱이 있으면 검색어들 보이게
          searchTerms[0] && isFocus && (
            <ul className="absolute w-full border-1 border-gray-200 rounded-xl p-[8px] bg-white mt-[10px] z-1">
              {searchTerms.map((term) => (
                <li
                  className="cursor-pointer hover:bg-gray-100 p-[12px] rounded-sm"
                  onMouseDown={() => onClickSearchTerm(term.id, term.name)}
                  key={term.id}
                >
                  {term.name}
                </li>
              ))}
            </ul>
          )
        }
      </div>
    </div>
  ),
  option: ({ label }) => (
    <div className="text-sm mb-[15px]">
      <p className="mb-[5px]">{label}</p>
    </div>
  ),
  date: ({ label }) => (
    <div className="text-sm mb-[15px]">
      <p className="mb-[5px]">{label}</p>
    </div>
  ),
  text: ({ label }) => (
    <div className="text-sm mb-[15px]">
      <p className="mb-[5px]">{label}</p>
    </div>
  ),
};

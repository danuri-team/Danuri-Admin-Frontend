import { SEARCH_TERMS } from "@/constants/modals";
import { getSearchTerm, type SearchLabel } from "@/utils/searchTermOption";
import { useEffect, useState } from "react";
import { type GenericInputProps, ModalInputLayout } from "../ModalInput";
import { IoCloseCircleSharp } from "react-icons/io5";

// 모달 검색 입력박스 컴포넌트
const SearchInput = ({ label, value, disabled, onChange, resetValue }: GenericInputProps) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchTerms, setSearchTerms] = useState<{ name: string; id: string }[]>([]);
  const [isFocus, setIsFocus] = useState<boolean>(false);

  useEffect(() => {
    // 검색어 디바운싱
    const debouncedTimer = setTimeout(async () => {
      if (Object.values(SEARCH_TERMS).some((item) => item === label)) {
        const terms = await getSearchTerm(label as SearchLabel, searchInput);
        setSearchTerms(terms);
      }
    }, 200);

    return () => {
      clearTimeout(debouncedTimer);
    };
  }, [searchInput, label]);

  useEffect(() => {
    if (value === "") {
      setSearchInput("");
    }
  }, [value]);

  const onClickSearchTerm = ({ id, name }: { id: string; name: string }) => {
    onChange(id);
    setSearchInput(name);
  };

  return (
    <>
      <ModalInputLayout.Label>{label}</ModalInputLayout.Label>
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
        {searchTerms[0] && isFocus && (
          <ModalInputLayout.TermList>
            {searchTerms.map((term) => (
              <ModalInputLayout.TermItem
                id={term.id}
                value={term.name}
                onClick={() => onClickSearchTerm(term)}
              />
            ))}
          </ModalInputLayout.TermList>
        )}
      </div>
    </>
  );
};

export default SearchInput;

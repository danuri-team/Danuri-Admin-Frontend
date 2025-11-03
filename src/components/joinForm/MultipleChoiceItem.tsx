// 가입 폼 - 객관식 문항 아이템

import { useSortable } from "@dnd-kit/sortable";
import HandleIcon from "@/assets/icons/handle-icon.svg?react";
import XIcon from "@/assets/icons/x-icon.svg?react";
import { CSS } from "@dnd-kit/utilities";

/**
 *
 * @param id - dnd 라이브러리에 사용되는 아이디
 * @param deleteQuestion - 객관식 문항 삭제 핸들러
 * @param changeOption - 객관식 문항 수정 핸들러
 * @param option - 문항 내용
 * @returns
 */
const MultipleChoiceItem = ({
  id,
  deleteQuestion,
  changeOption,
  option,
}: {
  id: number;
  deleteQuestion: (id: number) => void;
  changeOption: (e: React.ChangeEvent<HTMLInputElement>) => void;
  option: string;
}) => {
  // dnd 구현에 사용되는 반환 값
  const { attributes, setNodeRef, listeners, transform, transition } = useSortable({ id });

  // dnd 구현에 사용되는 style
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className="flex justify-between pl-[20px] pr-[20px] mb-[18px] items-center"
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div className="flex flex-1 items-center">
        {/* dnd 핸들 버튼 */}
        <button
          className="text-black cursor-pointer hover:bg-gray-100 p-[5px] rounded-sm self-center mr-[24px]"
          {...listeners}
          aria-label="drag handle"
        >
          <HandleIcon />
        </button>
        <div className="border-2 border-gray-200 w-[18px] h-[18px] rounded-md mr-[8px]"></div>
        {/* 문항 내용 */}
        <input
          className="flex-1 outline-none text-[15px]"
          type="text"
          value={option}
          onChange={changeOption}
        />
      </div>
      {/* 문항 삭제 */}
      <button
        className="text-black cursor-pointer hover:bg-gray-100 p-[5px] rounded-sm self-center"
        onClick={() => deleteQuestion(id)}
      >
        <XIcon />
      </button>
    </div>
  );
};

export default MultipleChoiceItem;

import { useSortable } from "@dnd-kit/sortable";
import HandleIcon from "../../assets/icons/handle-icon.svg?react";
import XIcon from "../../assets/icons/x-icon.svg?react";
import { CSS } from "@dnd-kit/utilities";

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
  const { attributes, setNodeRef, listeners, transform, transition } = useSortable({ id });

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
        <button
          className="text-black cursor-pointer hover:bg-gray-100 p-[5px] rounded-sm self-center mr-[24px]"
          {...listeners}
          aria-label="drag handle"
        >
          <HandleIcon />
        </button>
        <div className="border-2 border-gray-200 w-[18px] h-[18px] rounded-md mr-[8px]"></div>
        <input
          className="flex-1 outline-none text-[15px]"
          type="text"
          value={option}
          onChange={changeOption}
        />
      </div>
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

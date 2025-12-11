import { memo, type JSX, type ReactNode } from "react";

import DateTimeInput from "./inputs/DateTimeInput";
import SearchInput from "./inputs/SearchInput";
import OptionInput from "./inputs/OptionInput";
import DefaultInput from "./inputs/DefaultInput";
import QRInput from "./inputs/QRInput";
import CheckboxInput from "./inputs/CheckboxInput";

interface LabelProps {
  children: ReactNode;
}

interface TermListProps {
  children: ReactNode;
}

interface TermItemProps {
  id: string;
  value: string;
  onClick: () => void;
}

interface BaseProps {
  label: string;
  resetValue?: () => void;
  availableCount?: number;
  disabled?: boolean;
}

export interface DateTimeInputProps extends BaseProps {
  type: "date" | "time";
  value: Date | null;
  onChange: (date: Date | null) => void;
}

export interface GenericInputProps extends BaseProps {
  type: "search" | "text" | "number" | "option" | "image" | "checkbox";
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
}

type ModalInputType = DateTimeInputProps | GenericInputProps;

const INPUT_COMPONENT_MAP: Record<ModalInputType["type"], (props: ModalInputType) => JSX.Element> =
  {
    date: (props) => <DateTimeInput {...(props as DateTimeInputProps)} />,
    time: (props) => <DateTimeInput {...(props as DateTimeInputProps)} />,
    search: (props) => <SearchInput {...(props as GenericInputProps)} />,
    option: (props) => <OptionInput {...(props as GenericInputProps)} />,
    text: (props) => <DefaultInput {...(props as GenericInputProps)} />,
    number: (props) => <DefaultInput {...(props as GenericInputProps)} />,
    image: (props) => <QRInput {...(props as GenericInputProps)} />,
    checkbox: (props) => <CheckboxInput {...(props as GenericInputProps)} />,
  };

const ModalInput = (props: ModalInputType) => {
  return <div className="text-sm mb-[15px]">{INPUT_COMPONENT_MAP[props.type](props)}</div>;
};

const Label = memo<LabelProps>(({ children }) => {
  return <p className="mb-[5px]">{children}</p>;
});

Label.displayName = "ModalInputLayout.Label";

const TermList = memo<TermListProps>(({ children }) => {
  return (
    <ul className="absolute w-full border-1 border-gray-200 max-h-70 overflow-scroll rounded-xl p-[8px] bg-white mt-[10px] z-1">
      {children}
    </ul>
  );
});

TermList.displayName = "ModalInputLayout.TermList";

const TermItem = memo<TermItemProps>(({ id, value, onClick }) => {
  return (
    <li className={`cursor-pointer hover:bg-gray-100 p-[12px] rounded-sm`} onMouseDown={onClick}>
      {value}
    </li>
  );
});

TermItem.displayName = "ModalInputLayout.TermItem";

export const ModalInputLayout = Object.assign(memo(ModalInput), {
  Label,
  TermList,
  TermItem,
});

export default ModalInput;

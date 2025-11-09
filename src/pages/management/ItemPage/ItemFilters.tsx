import { memo } from "react";
import CustomSelect from "@/components/CustomSelect";

interface FilterSelectConfig {
  id: string;
  type: "select";
  options: string[];
}

interface ItemFiltersProps {
  // 선택된 값
  selectForm: {
    order: string;
  };
  // 선택 값 바뀌었을 때
  onFilterChange: (key: string, value: string | Date | null) => void;
  onResetFilter: () => void;
}

const FILTER_SELECTS: FilterSelectConfig[] = [
  { id: "order", type: "select", options: ["재고순", "이름순", "이용 가능 여부 순"] },
];

const ItemFilters = memo<ItemFiltersProps>(({ selectForm, onFilterChange }) => {
  return (
    <>
      {FILTER_SELECTS.map((item) => (
        <CustomSelect
          type={item.type}
          key={item.id}
          options={item.options}
          value={selectForm[item.id as keyof typeof selectForm]}
          onChange={(value) => onFilterChange(item.id, value as string | Date | null)}
        />
      ))}
    </>
  );
});

ItemFilters.displayName = "ItemFilters";

export default ItemFilters;

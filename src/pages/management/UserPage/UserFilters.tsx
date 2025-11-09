import { memo } from 'react';
import CustomSelect from '@/components/CustomSelect';
import { ResetFilterButton } from '@/components/layouts/ManagementLayout';

interface FilterSelectConfig {
  id: string;
  type: 'select' | 'date';
  options: string[];
}

interface UserFiltersProps {
  selectForm: {
    joinDate: Date | null;
    age: string;
    sex: string;
  };
  onFilterChange: (key: string, value: string | Date | null) => void;
  onResetFilter: () => void;
}

const FILTER_SELECTS: FilterSelectConfig[] = [
  { id: 'joinDate', type: 'date', options: ['가입일'] },
];

const UserFilters = memo<UserFiltersProps>(({
  selectForm,
  onFilterChange,
  onResetFilter,
}) => {
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
      <ResetFilterButton
        onClick={onResetFilter}
        show={!!selectForm.joinDate}
      />
    </>
  );
});

UserFilters.displayName = 'UserFilters';

export default UserFilters;
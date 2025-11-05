import { memo } from 'react';
import CustomTable from '@/components/CustomTable';
import { EmptyState } from '@/components/layouts/ManagementLayout';
import type { UsageData } from '@/components/CustomTable';
import type { TableHeader } from '@/types/table';

interface UserTableProps {
  userTableHeader: TableHeader[];
  filterData: UsageData[] | null;
  isDeleteMode: boolean;
  selectedRowId: string;
  totalPages: number;
  onRowClick: (row: UsageData) => void;
  onChangeSelectedRow: ({ id }: { id: string | null }) => void;
}

const UserTable = memo<UserTableProps>(({
  userTableHeader,
  filterData,
  isDeleteMode,
  selectedRowId,
  totalPages,
  onRowClick,
  onChangeSelectedRow,
}) => {
  if (userTableHeader.length === 0 || !filterData) {
    return (
      <EmptyState message="가입 폼 등록 후 이용 가능합니다." />
    );
  }

  return (
    <CustomTable
      header={userTableHeader}
      data={filterData}
      rowUpdate={onRowClick}
      isDeleteMode={isDeleteMode}
      changeSelectedRow={onChangeSelectedRow}
      selectedRowId={selectedRowId}
      totalPages={totalPages}
    />
  );
});

UserTable.displayName = 'UserTable';

export default UserTable;
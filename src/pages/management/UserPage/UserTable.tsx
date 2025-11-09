import { memo } from "react";
import CustomTable from "@/components/CustomTable";
import { EmptyState } from "@/components/layouts/ManagementLayout";
import type { ManagementTableProps } from "@/types/table";

const UserTable = memo<ManagementTableProps>(
  ({
    tableHeader,
    filterData,
    isDeleteMode,
    selectedRowId,
    totalPages,
    onRowClick,
    onChangeSelectedRow,
  }) => {
    if (tableHeader.length === 0 || !filterData) {
      return <EmptyState message="가입 폼 등록 후 이용 가능합니다." />;
    }

    return (
      <CustomTable
        header={tableHeader}
        data={filterData}
        rowUpdate={onRowClick}
        isDeleteMode={isDeleteMode}
        changeSelectedRow={onChangeSelectedRow}
        selectedRowId={selectedRowId}
        totalPages={totalPages}
      />
    );
  }
);

UserTable.displayName = "UserTable";

export default UserTable;

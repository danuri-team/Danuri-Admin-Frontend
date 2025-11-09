import { memo } from "react";
import CustomTable from "@/components/CustomTable";
import { EmptyState } from "@/components/layouts/ManagementLayout";
import type { ManagementTableProps } from "@/types/table";

const SpaceTable = memo<ManagementTableProps>(
  ({
    tableHeader,
    filterData,
    isDeleteMode,
    selectedRowId,
    totalPages,
    onRowClick,
    onChangeSelectedRow,
  }) => {
    if (!filterData || filterData.length === 0) {
      return <EmptyState message="물품이 존재하지 않습니다." />;
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

SpaceTable.displayName = "SpaceTable";

export default SpaceTable;

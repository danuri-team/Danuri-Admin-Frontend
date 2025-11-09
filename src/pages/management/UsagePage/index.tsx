import ManagementLayout from "@/components/layouts/ManagementLayout";
import Modal from "@/components/modal/Modal";
import UserFilters from "./UsageFilters";
import UserActions from "./UsageActions";
import UsageTable from "./UsageTable";
import { useUsagePage } from "@/hooks/page/useUsagePage";
import type { UsageData } from "@/types/table";

const UserPage = () => {
  const {
    // State
    userTableHeader,
    totalPages,
    tableData,
    isDeleteMode,
    selectedRowId,
    selectForm,
    modal,

    // Handlers
    handleChangeSelectedRow,
    handleTableButton,
    handleTableRowClick,
    handleModalSubmit,
    handleResetFilter,
    handleRentalNavigate,
    handleFilterChange,
  } = useUsagePage();

  return (
    <ManagementLayout>
      <ManagementLayout.Header title="이용 현황">
        <ManagementLayout.Filters>
          <UserFilters
            selectForm={selectForm}
            onFilterChange={handleFilterChange}
            onResetFilter={handleResetFilter}
          />
        </ManagementLayout.Filters>
        <ManagementLayout.Actions>
          <UserActions
            onTableButton={handleTableButton}
            onRentalNavigate={handleRentalNavigate}
            isDeleteMode={isDeleteMode}
          />
        </ManagementLayout.Actions>
      </ManagementLayout.Header>

      <ManagementLayout.Table>
        <UsageTable
          tableHeader={userTableHeader}
          filterData={tableData as UsageData[]}
          isDeleteMode={isDeleteMode}
          selectedRowId={selectedRowId}
          totalPages={totalPages}
          onRowClick={handleTableRowClick}
          onChangeSelectedRow={handleChangeSelectedRow}
        />
      </ManagementLayout.Table>

      {modal.isOpen && modal.inputs && modal.title && (
        <Modal
          isOpen={modal.isOpen}
          title={modal.title}
          inputs={modal.inputs}
          onClose={modal.closeModal}
          onSubmit={handleModalSubmit}
        />
      )}
    </ManagementLayout>
  );
};

export default UserPage;

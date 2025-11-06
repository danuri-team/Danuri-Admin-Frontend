import ManagementLayout from "@/components/layouts/ManagementLayout";
import Modal from "@/components/modal/Modal";
import RentalFilters from "./RentalFilters";
import RentalActions from "./RentalActions";
import RentalTable from "./RentalTable";
import { useRentalPage } from "@/hooks/page/useRentalPage";
import type { UsageData } from "@/types/table";

const RentalPage = () => {
  const {
    // State
    rentalTableHeader,
    totalPages,
    sortTableData,
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
    handleFilterChange,
  } = useRentalPage();

  return (
    <ManagementLayout>
      <ManagementLayout.Header title="대여 관리">
        <ManagementLayout.Filters>
          <RentalFilters
            selectForm={selectForm}
            onFilterChange={handleFilterChange}
            onResetFilter={handleResetFilter}
          />
        </ManagementLayout.Filters>
        <ManagementLayout.Actions>
          <RentalActions onTableButton={handleTableButton} />
        </ManagementLayout.Actions>
      </ManagementLayout.Header>

      <ManagementLayout.Table>
        <RentalTable
          tableHeader={rentalTableHeader}
          filterData={sortTableData as UsageData[]}
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

export default RentalPage;

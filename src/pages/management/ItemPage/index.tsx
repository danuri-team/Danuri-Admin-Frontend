import ManagementLayout from "@/components/layouts/ManagementLayout";
import Modal from "@/components/modal/Modal";
import ItemFilters from "./ItemFilters";
import ItemActions from "./ItemActions";
import ItemTable from "./ItemTable";
import { useItemPage } from "@/hooks/page/useItemPage";
import type { UsageData } from "@/types/table";

const ItemPage = () => {
  const {
    // State
    itemTableHeader,
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
  } = useItemPage();

  return (
    <ManagementLayout>
      <ManagementLayout.Header title="물품 관리">
        <ManagementLayout.Filters>
          <ItemFilters
            selectForm={selectForm}
            onFilterChange={handleFilterChange}
            onResetFilter={handleResetFilter}
          />
        </ManagementLayout.Filters>
        <ManagementLayout.Actions>
          <ItemActions onTableButton={handleTableButton} isDeleteMode={isDeleteMode} />
        </ManagementLayout.Actions>
      </ManagementLayout.Header>

      <ManagementLayout.Table>
        <ItemTable
          tableHeader={itemTableHeader}
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

export default ItemPage;

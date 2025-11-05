import ManagementLayout from "@/components/layouts/ManagementLayout";
import Modal from "@/components/modal/Modal";
import ItemActions from "./SpaceActions";
import ItemTable from "./SpaceTable";
import { useSpacePage } from "@/hooks/page/useSpacePage";
import type { UsageData } from "@/types/table";

const SpacePage = () => {
  const {
    // State
    spaceTableHeader,
    totalPages,
    tableData,
    isDeleteMode,
    selectedRowId,
    modal,

    // Handlers
    handleChangeSelectedRow,
    handleTableButton,
    handleTableRowClick,
    handleModalSubmit,
  } = useSpacePage();

  return (
    <ManagementLayout>
      <ManagementLayout.Header title="공간 관리">
        <div></div>
        <ManagementLayout.Actions>
          <ItemActions onTableButton={handleTableButton} isDeleteMode={isDeleteMode} />
        </ManagementLayout.Actions>
      </ManagementLayout.Header>

      <ManagementLayout.Table>
        <ItemTable
          tableHeader={spaceTableHeader}
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

export default SpacePage;

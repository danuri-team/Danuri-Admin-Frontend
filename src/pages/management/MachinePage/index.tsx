import ManagementLayout from "@/components/layouts/ManagementLayout";
import Modal from "@/components/modal/Modal";
import ItemActions from "./MachineActions";
import ItemTable from "./MachineTable";
import { useMachinePage } from "@/hooks/page/useMachinePage";
import type { UsageData } from "@/types/table";

const MachinePage = () => {
  const {
    // State
    machineTableHeader,
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
  } = useMachinePage();

  return (
    <ManagementLayout>
      <ManagementLayout.Header title="기기 관리">
        <div></div>
        <ManagementLayout.Actions>
          <ItemActions onTableButton={handleTableButton} isDeleteMode={isDeleteMode} />
        </ManagementLayout.Actions>
      </ManagementLayout.Header>

      <ManagementLayout.Table>
        <ItemTable
          tableHeader={machineTableHeader}
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

export default MachinePage;

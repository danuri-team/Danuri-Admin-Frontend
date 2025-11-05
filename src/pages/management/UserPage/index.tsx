import ManagementLayout from "@/components/layouts/ManagementLayout";
import Modal from "@/components/modal/Modal";
import UserFilters from "./UserFilters";
import UserActions from "./UserActions";
import UserTable from "./UserTable";
import { useUserPage } from "../../../hooks/page/useUserPage";

const UserPage = () => {
  const {
    // State
    userTableHeader,
    totalPages,
    filterData,
    isDeleteMode,
    selectedRowId,
    selectForm,
    isJoinForm,
    modal,

    // Handlers
    handleChangeSelectedRow,
    handleTableButton,
    handleTableRowClick,
    handleModalSubmit,
    handleResetFilter,
    handleJoinFormNavigate,
    handleFilterChange,
  } = useUserPage();

  return (
    <ManagementLayout>
      <ManagementLayout.Header title="사용자 관리">
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
            onJoinFormNavigate={handleJoinFormNavigate}
            isDeleteMode={isDeleteMode}
            isJoinForm={isJoinForm}
          />
        </ManagementLayout.Actions>
      </ManagementLayout.Header>

      <ManagementLayout.Table>
        <UserTable
          userTableHeader={userTableHeader}
          filterData={filterData}
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

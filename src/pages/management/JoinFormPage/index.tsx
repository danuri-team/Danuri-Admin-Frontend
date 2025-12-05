import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import JoinFormItem from "@/components/joinForm/FormItem";
import CustomButton from "@/components/CustomButton";
import ManagementLayout from "@/components/layouts/ManagementLayout";

import JoinFormActions from "./JoinFormActions";
import { useJoinFormPage } from "@/hooks/page/useJoinFormPage";

const JoinFormPage = () => {
  const {
    formItems,
    sensors,
    handleDragEnd,
    handleFormItem,
    addFormItem,
    deleteFormItem,
    onSubmitForm,
  } = useJoinFormPage();

  return (
    <ManagementLayout>
      <ManagementLayout.Header title="가입 폼 관리">
        <div></div>
        <ManagementLayout.Actions>
          <JoinFormActions onSubmitForm={addFormItem} />
        </ManagementLayout.Actions>
      </ManagementLayout.Header>
      <div className="flex-1 max-w-360 w-full justify-self-center mr-[50px] ml-[50px] text-nowrap">
        <div className="mr-[20px] ml-[20px] mb-[30px] flex justify-between"></div>
        <div className="w-full">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={formItems} strategy={verticalListSortingStrategy}>
              {formItems.map((item, index) => (
                <JoinFormItem
                  key={item.id}
                  index={index}
                  deleteFormItem={deleteFormItem}
                  addFormItem={addFormItem}
                  changeFormItem={handleFormItem}
                  {...item}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
        <div className="w-[112px] justify-self-end mb-[50px]">
          <CustomButton value="저장" onClick={onSubmitForm} />
        </div>
      </div>
    </ManagementLayout>
  );
};

export default JoinFormPage;

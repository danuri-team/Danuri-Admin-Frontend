import { DndContext, KeyboardSensor, MouseSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core"
import BannerButton from "../../components/BannerButton"
import MainHeader from "../../components/MainHeader"
import TableButton from "../../components/TableButton"
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useState } from "react"
import FormItem from "../../components/joinForm/FormItem"

type FormItem = {
  label: string,
  options: string[],
  placeHolder: string | null,
  isRequired: boolean,
  isMultiSelect: boolean | null,
};

const JoinFormPage = () => {
  const [formItems, setFormItems] = useState<number[]>([1,2,3])

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;

    if(over && active.id !== over.id){
      const preIndex = formItems.indexOf(Number(active.id));
      const newIndex = formItems.indexOf(Number(over.id));

      setFormItems((items)=>arrayMove(items, preIndex, newIndex))
    }    
  }

  const addFormItem = () => {
    const newItemId = Math.max(...formItems)+1
    setFormItems((items)=> [...items, newItemId]);
  }

  const deleteFormItem = (id:number) => {
    const newFormItems = formItems.filter((item)=>item!==id);
    setFormItems(newFormItems);
  }

  return(
    <div className="w-full min-w-[400px]">
    <MainHeader />
    <BannerButton />
      <div className="flex-1 mr-[50px] ml-[50px] text-nowrap">
        <div className="mr-[20px] ml-[20px] mb-[30px] flex justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">가입 폼 관리</h1>
          </div>
          <div className="flex gap-[10px]">
            <TableButton value="추가" onClick={addFormItem} />
          </div>
        </div>
        <div className="w-full">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={formItems} strategy={verticalListSortingStrategy}>
              {formItems.map((id,index)=>(
                <FormItem key={id} id={id} index={index} deleteFormItem={deleteFormItem} addFormItem={addFormItem}/>
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  )
}

export default JoinFormPage
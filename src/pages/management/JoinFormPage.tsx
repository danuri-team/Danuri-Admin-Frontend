import { DndContext, KeyboardSensor, MouseSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core"
import BannerButton from "../../components/BannerButton"
import MainHeader from "../../components/MainHeader"
import TableButton from "../../components/TableButton"
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useState } from "react"
import FormItem from "../../components/joinForm/FormItem"

export type FormItemType = {
  id:number,
  label: string,
  options: {id:number, option: string}[],
  placeHolder: string | null,
  isRequired: boolean,
  isMultiSelect: boolean,
};

const JoinFormPage = () => {
  const [formItems, setFormItems] = useState<FormItemType[]>([])

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleFormItem = (id:number, key: keyof FormItemType, value: string | {id:number, option:string}[] | boolean) => {
    setFormItems((prev)=> (prev.map((item) => {
      if(item.id === id){
        return {
          ...item,
          [key]:value
        }
      }
      return {...item}
    })))

  }

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;

    if(over && active.id !== over.id){
      const preIndex = formItems.findIndex(item=>Number(active.id) === item.id);
      const newIndex = formItems.findIndex(item=>(over.id) === item.id);

      setFormItems((items)=>arrayMove(items, preIndex, newIndex))
    }    
  }

  const addFormItem = (id?:number) => {
    const newItemId = formItems.length > 0 ? Math.max(...formItems.map((item=>item.id)))+1 : 0;
    if(id===undefined){
      setFormItems((items)=> [...items, {
        id:newItemId,
        label: '',
        options: [{id:0, option: ''}],
        placeHolder: '',
        isRequired: true,
        isMultiSelect: false,
      } as FormItemType]);
    }
    else {
      const target = formItems.find((item)=>item.id===id);
      console.log(target, formItems.find((item)=>item.id===id));
      if(target){
        setFormItems((items)=> [...items, {
          id:newItemId,
          label:target.label,
          options: target.options,
          placeHolder: target.placeHolder,
          isRequired: target.isRequired,
          isMultiSelect: target.isMultiSelect,
        }])

      }
    }
  }

  const deleteFormItem = (id:number) => {
    const newFormItems = formItems.filter((item)=>item.id!==id);
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
            <TableButton value="추가" onClick={()=>addFormItem()} />
          </div>
        </div>
        <div className="w-full">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={formItems} strategy={verticalListSortingStrategy}>
              {formItems.map((item,index)=>(
                <FormItem key={item.id} index={index} deleteFormItem={deleteFormItem} addFormItem={addFormItem} changeFormItem={handleFormItem} {...item} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  )
}

export default JoinFormPage
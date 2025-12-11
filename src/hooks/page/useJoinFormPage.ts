import { useEffect, useState } from "react";

import { toast } from "react-toastify";

import {
  KeyboardSensor,
  MouseSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { FormItem } from "@/types/domains/form";
import { getJoinForm, postJoinForm } from "@/services/api/FormAPI";
import type { ApiError } from "@/types/api";

// Hook
export const useJoinFormPage = () => {
  const [formItems, setFormItems] = useState<FormItem[]>([]);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleFormItem = (
    id: number,
    key: keyof FormItem,
    value: string | { id: number; option: string }[] | boolean
  ) => {
    setFormItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            [key]: value,
          };
        }
        return { ...item };
      })
    );
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const preIndex = formItems.findIndex((item) => Number(active.id) === item.id);
      const newIndex = formItems.findIndex((item) => over.id === item.id);

      setFormItems((items) => arrayMove(items, preIndex, newIndex));
    }
  };

  const addFormItem = (id?: number) => {
    const newItemId = formItems.length > 0 ? Math.max(...formItems.map((item) => item.id)) + 1 : 0;
    if (id === undefined) {
      setFormItems((items) => [
        ...items,
        {
          id: newItemId,
          label: "",
          type: "CHECK",
          options: [{ id: 0, option: "" }],
          placeHolder: "",
          isRequired: true,
          isMultiSelect: false,
        } as FormItem,
      ]);
    } else {
      const target = formItems.find((item) => item.id === id);
      if (target) {
        setFormItems((items) => [
          ...items,
          {
            id: newItemId,
            type: target.type,
            label: target.label,
            options: target.options,
            placeHolder: target.placeHolder,
            isRequired: target.isRequired,
            isMultiSelect: target.isMultiSelect,
          },
        ]);
      }
    }
  };

  const deleteFormItem = (id: number) => {
    const newFormItems = formItems.filter((item) => item.id !== id);
    setFormItems(newFormItems);
  };

  const onSubmitForm = async () => {
    const res = await postJoinForm(formItems);
    if (res.pass) {
      toast.success("저장되었습니다.");
    } else {
      const error = res.data as unknown as ApiError;
      toast.error(error.details?.status_message || error.message);
    }
  };

  useEffect(() => {
    const getData = async () => {
      const res = await getJoinForm();
      if (res.pass) {
      }
    };
    getData();
  }, []);

  return {
    // State
    formItems,
    sensors,

    // Handlers
    handleFormItem,
    handleDragEnd,
    addFormItem,
    deleteFormItem,
    onSubmitForm,
  };
};

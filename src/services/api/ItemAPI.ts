import { PrivateAxios } from "../PrivateAxios";

//아이템 생성
export const postCreateItem = async ({
  name,
  totalQuantity,
  availableQuantity,
  status,
}: {
  name: string;
  totalQuantity: string;
  availableQuantity: string;
  status: string;
}) => {
  try {
    if (Number(availableQuantity) > Number(totalQuantity)) {
      return { data: "사용 가능한 수량이 총 수량을 초과할 수 없습니다.", pass: false };
    }
    const res = await PrivateAxios.post("/admin/items", {
      name,
      total_quantity: totalQuantity,
      available_quantity: availableQuantity,
      status,
    });
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

//아이템 수정
export const putUpdateItem = async ({
  itemId,
  name,
  totalQuantity,
  availableQuantity,
  status,
}: {
  itemId: string;
  name: string;
  totalQuantity: string;
  availableQuantity: string;
  status: string;
}) => {
  try {
    if (Number(availableQuantity) > Number(totalQuantity)) {
      return { data: "사용 가능한 수량이 총 수량을 초과할 수 없습니다.", pass: false };
    }
    const res = await PrivateAxios.put(`/admin/items/${itemId}`, {
      name,
      total_quantity: totalQuantity,
      available_quantity: availableQuantity,
      status,
    });
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

//아이템 삭제
export const deleteItem = async ({ itemId }: { itemId: string }) => {
  try {
    const res = await PrivateAxios.delete(`/admin/items/${itemId}`);
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

//아이템 조회
export const getSearchItem = async ({ itemId }: { itemId: string }) => {
  try {
    const res = await PrivateAxios.get(`/admin/items/${itemId}`);
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

//사내 아이템 조회
export const getSearchCompanyItem = async ({ page, size }: { page: number; size: number }) => {
  try {
    const res = await PrivateAxios.get(`/admin/items?page=${page}&size=${size}`);
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

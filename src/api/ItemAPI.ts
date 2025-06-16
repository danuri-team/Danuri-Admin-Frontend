import { PrivateAxios } from "./PrivateAxios";

//아이템 생성
export const postCreateItem = async ({
  name,
  totalQuantity,
  status,
}: {
  name: string;
  totalQuantity: string;
  status: string;
}) => {
  try {
    const res = await PrivateAxios.post("/admin/items", {
      name,
      total_quantity: totalQuantity,
      status,
    });
    return { data: res, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

//아이템 수정
export const putUpdateItem = async ({
  itemId,
  name,
  totalQuantity,
  status,
}: {
  itemId: string;
  name: string;
  totalQuantity: string;
  status: string;
}) => {
  try {
    const res = await PrivateAxios.put(`/admin/items/${itemId}`, {
      name,
      total_quantity: totalQuantity,
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
export const getSearchCompanyItem = async () => {
  try {
    const res = await PrivateAxios.get("/admin/items");
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

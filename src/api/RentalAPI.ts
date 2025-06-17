import { PrivateAxios } from "./PrivateAxios";

//사내 대여 생성
export const postCreateRental = async ({
  itemId,
  quantity,
  userId,
}: {
  itemId: number;
  quantity: number;
  userId: string;
}) => {
  try {
    const res = await PrivateAxios.post("/admin/rentals", {
      itemId,
      quantity,
      userId
    });
    return { data: res, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

//사내 대여 수정
export const putUpdateRetal = async ({
  rentalId,
  quantity,
  returnedQuantity,
  status,
}: {
  rentalId: string;
  quantity: number;
  returnedQuantity: number;
  status: string;
}) => {
  try {
    const res = await PrivateAxios.put(`/admin/rentals/${rentalId}`, {
      quantity,
      returned_quantity: returnedQuantity,
      status,
    });
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

//사내 대여 삭제
export const deleteRental = async ({ rentalId }: { rentalId: string }) => {
  try {
    const res = await PrivateAxios.delete(`/admin/rentals/${rentalId}`);
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

//사내 특정 대여 조회
export const getSearchRental = async ({ rentalId }: { rentalId: string }) => {
  try {
    const res = await PrivateAxios.get(`/admin/rentals/${rentalId}`);
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

//사내 전체 대여 조회
export const getSearchCompanyRental = async () => {
  try {
    const res = await PrivateAxios.get("/admin/rentals");
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

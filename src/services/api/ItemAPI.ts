import { PrivateAxios } from "../PrivateAxios";
import { BaseAPI } from "./BaseAPI";
import type { ApiResponse, PaginatedResponse, PaginationParams } from "@/types/api";
import type {
  Item,
  CreateItemRequest,
  UpdateItemRequest,
  ItemIdRequest,
} from "@/types/domains/item";
import { validateItemQuantities } from "@/utils/validation/itemValidation";

class ItemAPIService extends BaseAPI {
  async postCreateItem(data: CreateItemRequest): Promise<ApiResponse<Item>> {
    const { name, totalQuantity, availableQuantity, status } = data;

    const validation = validateItemQuantities(totalQuantity, availableQuantity);
    if (!validation.valid) {
      return {
        data: validation.error as never,
        pass: false,
      };
    }

    return this.post<Item>("/admin/items", {
      name,
      total_quantity: totalQuantity,
      available_quantity: availableQuantity,
      status,
    });
  }

  async putUpdateItem(data: UpdateItemRequest): Promise<ApiResponse<Item>> {
    const { itemId, name, totalQuantity, availableQuantity, status } = data;

    const validation = validateItemQuantities(totalQuantity, availableQuantity);
    if (!validation.valid) {
      return {
        data: validation.error as never,
        pass: false,
      };
    }

    return this.put<Item>(`/admin/items/${itemId}`, {
      name,
      total_quantity: totalQuantity,
      available_quantity: availableQuantity,
      status,
    });
  }

  async deleteItem({ itemId }: ItemIdRequest): Promise<ApiResponse<void>> {
    return this.delete<void>(`/admin/items/${itemId}`);
  }

  async getSearchItem({ itemId }: ItemIdRequest): Promise<ApiResponse<Item>> {
    return this.get<Item>(`/admin/items/${itemId}`);
  }

  async getSearchCompanyItem(
    params: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Item>>> {
    return this.get<PaginatedResponse<Item>>("/admin/items", { params });
  }
}

export const ItemAPI = new ItemAPIService(PrivateAxios);

export const postCreateItem = (data: CreateItemRequest) => ItemAPI.postCreateItem(data);
export const putUpdateItem = (data: UpdateItemRequest) => ItemAPI.putUpdateItem(data);
export const deleteItem = (params: ItemIdRequest) => ItemAPI.deleteItem(params);
export const getSearchItem = (params: ItemIdRequest) => ItemAPI.getSearchItem(params);
export const getSearchCompanyItem = (params: PaginationParams) =>
  ItemAPI.getSearchCompanyItem(params);

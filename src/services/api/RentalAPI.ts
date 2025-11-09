import { PrivateAxios } from "../PrivateAxios";
import { BaseAPI } from "./BaseAPI";
import type { ApiResponse, PaginatedResponse, PaginationParams } from "@/types/api";
import type {
  Rental,
  CreateRentalRequest,
  UpdateRentalRequest,
  RentalIdRequest,
} from "@/types/domains/rental";

class RentalAPIService extends BaseAPI {
  async postCreateRental(data: CreateRentalRequest): Promise<ApiResponse<Rental>> {
    const { itemId, quantity, usageId } = data;
    return this.post<Rental>("/admin/rentals", {
      item_id: itemId,
      quantity,
      usage_id: usageId,
    });
  }

  async putUpdateRental(data: UpdateRentalRequest): Promise<ApiResponse<Rental>> {
    const { rentalId, quantity, returnedQuantity, status } = data;
    return this.put<Rental>(`/admin/rentals/${rentalId}`, {
      quantity,
      returned_quantity: returnedQuantity,
      status,
    });
  }

  async deleteRental({ rentalId }: RentalIdRequest): Promise<ApiResponse<void>> {
    return this.delete<void>(`/admin/rentals/${rentalId}`);
  }

  async getSearchRental({ rentalId }: RentalIdRequest): Promise<ApiResponse<Rental>> {
    return this.get<Rental>(`/admin/rentals/${rentalId}`);
  }

  async getSearchCompanyRental(
    params: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Rental>>> {
    return this.get<PaginatedResponse<Rental>>("/admin/rentals", { params });
  }
}

export const RentalAPI = new RentalAPIService(PrivateAxios);

export const postCreateRental = (data: CreateRentalRequest) => RentalAPI.postCreateRental(data);
export const putUpdateRental = (data: UpdateRentalRequest) => RentalAPI.putUpdateRental(data);
export const deleteRental = (params: RentalIdRequest) => RentalAPI.deleteRental(params);
export const getSearchRental = (params: RentalIdRequest) => RentalAPI.getSearchRental(params);
export const getSearchCompanyRental = (params: PaginationParams) =>
  RentalAPI.getSearchCompanyRental(params);

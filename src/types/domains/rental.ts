export interface Rental {
  id: string;
  item_id: string;
  quantity: number;
  returned_quantity: number;
  usage_id: string;
  status: string;
  [key: string]: unknown;
}

export interface CreateRentalRequest {
  itemId: string;
  quantity: number;
  usageId: string;
}

export interface UpdateRentalRequest {
  rentalId: string;
  quantity: number;
  returnedQuantity: number;
  status: string;
}

export interface RentalIdRequest {
  rentalId: string;
}

export interface Item {
  id: string;
  name: string;
  total_quantity: number;
  available_quantity: number;
  status: string;
  [key: string]: unknown;
}

export interface CreateItemRequest {
  name: string;
  totalQuantity: string;
  availableQuantity: string;
  status: string;
}

export interface UpdateItemRequest {
  itemId: string;
  name: string;
  totalQuantity: string;
  availableQuantity: string;
  status: string;
}

export interface ItemIdRequest {
  itemId: string;
}

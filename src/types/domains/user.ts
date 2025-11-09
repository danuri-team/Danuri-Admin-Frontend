export interface User {
  id: string;
  company_id: string;
  phone: string;
  [key: string]: unknown;
}

export interface CreateUserRequest {
  company_id: string;
  phone: string;
}

export interface UpdateUserRequest {
  userId: string;
  phone: string;
}

export interface UserIdRequest {
  userId: string;
}

export interface UserApiResponse {
  id: string;
  phone: string;
  sign_up_form_schema: string;
  created_at: string;
  updated_at: string;
  usage_count: number;
  [key: string]: unknown;
}

export interface UserListResponse {
  user_list: {
    content: UserApiResponse[];
    page: number;
    size: number;
    total: number;
    total_pages: number;
  };
  header_list: string[];
}

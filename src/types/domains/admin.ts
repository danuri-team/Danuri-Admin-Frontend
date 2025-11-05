export interface Admin {
  id: string;
  email: string;
  phone: string;
  role: string;
  company_id: string;
  company_name: string;
  [key: string]: unknown;
}

export interface UpdateAdminRequest {
  id: string;
  email: string;
  phone: string;
  role: string;
}

export interface AdminIdRequest {
  adminId: string;
}

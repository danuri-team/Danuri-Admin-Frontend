export interface Admin {
  id: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
  company_id: string;
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

import { PrivateAxios } from "../PrivateAxios";
import { BaseAPI } from "./BaseAPI";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { Form, UpdateFormRequest, FormItem } from "@/types/domains/form";

class FormAPIService extends BaseAPI {
  async postJoinForm(form: FormItem[]): Promise<ApiResponse<Form>> {
    return this.post<Form>("/admin/forms", {
      title: "가입폼",
      schema: JSON.stringify(form),
      is_sign_up_form: true,
    });
  }

  async putJoinForm(data: UpdateFormRequest): Promise<ApiResponse<Form>> {
    const { deviceId, spaceId, isActivate } = data;
    return this.put<Form>(`/admin/forms/${deviceId}`, {
      space_id: spaceId,
      is_activate: isActivate,
    });
  }

  async getJoinForm(): Promise<ApiResponse<PaginatedResponse<Form>>> {
    return this.get<PaginatedResponse<Form>>("/admin/forms");
  }
}

export const FormAPI = new FormAPIService(PrivateAxios);

export const postJoinForm = (form: FormItem[]) => FormAPI.postJoinForm(form);
export const putJoinForm = (data: UpdateFormRequest) => FormAPI.putJoinForm(data);
export const getJoinForm = () => FormAPI.getJoinForm();

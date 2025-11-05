export interface FormItem {
  id: number;
  type: string;
  label: string;
  options?: { id: number; option: string }[];
  placeHolder?: string | null;
  isRequired?: boolean;
  isMultiSelect?: boolean;
}

export interface Form {
  id: string;
  title: string;
  schema: string;
  is_sign_up_form: boolean;
}

export interface CreateFormRequest {
  title: string;
  schema: string;
  is_sign_up_form: boolean;
}

export interface UpdateFormRequest {
  deviceId: string;
  spaceId: string;
  isActivate: boolean;
}

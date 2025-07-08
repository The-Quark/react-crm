export interface IApplicationPostFormValues {
  source: string;
  company_name?: string;
  bin?: string;
  first_name?: string;
  last_name?: string;
  patronymic?: string;
  client_type: 'individual' | 'legal';
  phone: string;
  client_id?: number | null | string;
  email?: string | null;
  message?: string | null;
  status?: string;
  weight?: number | string;
  width?: number | string;
  length?: number | string;
  height?: number | string;
  box_height?: string | number;
  box_length?: string | number;
  box_width?: string | number;
  box_type_id?: string | number;
}

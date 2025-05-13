interface CrmLanguage {
  id: number;
  created_at: string;
  updated_at: string;
  code: string;
  name: string;
  native_name: string;
  locale: string;
  direction: 'ltr' | 'rtl';
  is_active: boolean;
  deleted_at: string | null;
}

interface Language {
  id: number;
  template_id: number;
  language_id: number;
  title: string;
  subject: string;
  content: string;
  file_path: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  crm_language: CrmLanguage;
  file: any;
}
export enum TemplateType {
  EMAIL = 'email',
  SMS = 'sms',
  PRINT_FORM = 'print_form'
}
export interface Template {
  id: number;
  company_id: number;
  code: string;
  type: TemplateType;
  company_name: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  language: Language[];
}

export interface ITemplatesResponse {
  result: Template[];
  count: number;
}

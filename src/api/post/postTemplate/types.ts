import { TemplateType } from '@/api/get/getTemplates/types';
export interface ITemplatesFormValues {
  code: string;
  company_id: string;
  language_code: string;
  type: TemplateType;
  title: string;
  subject: string;
  content: string;
  file_path?: string;
}

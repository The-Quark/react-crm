import axios from 'axios';
import { TEMPLATE_URL } from '@/api/url';
import { ITemplatesResponse } from '@/api/get/getGuides/getTemplates/types.ts';

interface ITemplatesFilters {
  id?: number;
  company_id?: number;
  type?: string;
  code?: string;
  language_code?: string;
}

const getTemplates = async (filters?: ITemplatesFilters): Promise<ITemplatesResponse> => {
  const queryParams = new URLSearchParams();

  if (filters) {
    if (filters.id !== undefined) queryParams.append('id', filters.id.toString());
    if (filters.company_id !== undefined)
      queryParams.append('company_id', filters.company_id.toString());
    if (filters.type !== undefined) queryParams.append('type', filters.type);
    if (filters.code !== undefined) queryParams.append('code', filters.code);
    if (filters.language_code !== undefined)
      queryParams.append('language_code', filters.language_code);
  }

  const url = filters ? `${TEMPLATE_URL}?${queryParams.toString()}` : TEMPLATE_URL;

  return await axios.get<ITemplatesResponse>(url).then((res) => res.data);
};

export { getTemplates };

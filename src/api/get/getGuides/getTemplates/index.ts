import axios from 'axios';
import { TEMPLATE_URL } from '@/api/url';
import { ITemplatesResponse } from '@/api/get/getGuides/getTemplates/types.ts';
import { IPaginationParams } from '@/api/generalManualTypes';

interface ITemplatesFilters extends IPaginationParams {
  id?: number;
  company_id?: number;
  type?: string;
  code?: string;
  title?: string;
  language_code?: string;
}

const getTemplates = async ({
  language_code,
  code,
  id,
  type,
  company_id,
  page,
  per_page,
  title
}: ITemplatesFilters): Promise<ITemplatesResponse> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', (page + 1).toString());
  if (language_code) params.append('language_code', language_code.toString());
  if (code) params.append('code', code.toString());
  if (title) params.append('title', title.toString());
  if (type) params.append('type', type.toString());
  if (company_id) params.append('company_id', company_id.toString());

  return await axios.get<ITemplatesResponse>(TEMPLATE_URL, { params }).then((res) => res.data);
};

export { getTemplates };

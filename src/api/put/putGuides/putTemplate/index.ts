import axios from 'axios';
import { ITemplatesFormValues } from '@/api/post/postGuides/postTemplate/types.ts';
import { TEMPLATE_URL } from '@/api/url';

export const putTemplate = async (
  id: number,
  data: Omit<ITemplatesFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<ITemplatesFormValues> => {
  return await axios
    .put<ITemplatesFormValues>(`${TEMPLATE_URL}?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};

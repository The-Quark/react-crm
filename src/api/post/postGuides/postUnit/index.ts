import axios from 'axios';
import { IUnitsFormValues } from '@/api/post/postGuides/postUnit/types.ts';
import { UNIT_URL } from '@/api/url';

export const postUnit = async (
  data: Omit<IUnitsFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IUnitsFormValues> => {
  return await axios
    .post<IUnitsFormValues>(UNIT_URL, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};

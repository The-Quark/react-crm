import axios from 'axios';
import { BOX_TYPES } from '@/api/url';
import { IBoxTypeFormValues } from '@/api/post/postGuides/postBoxType/types.ts';

export const postBoxType = async (
  data: Omit<IBoxTypeFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IBoxTypeFormValues> => {
  return await axios
    .post<IBoxTypeFormValues>(BOX_TYPES, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};

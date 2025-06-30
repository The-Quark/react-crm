import axios from 'axios';
import { IBoxTypeFormValues } from '@/api/post/postGuides/postBoxType/types.ts';
import { BOX_TYPES } from '@/api/url';

export const putBoxType = async (
  id: number,
  data: IBoxTypeFormValues
): Promise<IBoxTypeFormValues> => {
  return await axios
    .put<IBoxTypeFormValues>(`${BOX_TYPES}/manage/?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};

import axios from 'axios';
import { FILE_TYPE } from '@/api/url';
import { IFileTypeFormValues } from '@/api/post/postGuides/postFileType/types.ts';

export const putFileType = async (
  id: number,
  data: Omit<IFileTypeFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IFileTypeFormValues> => {
  return await axios
    .put<IFileTypeFormValues>(`${FILE_TYPE}?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};

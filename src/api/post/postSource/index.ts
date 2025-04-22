import axios from 'axios';
import { ISourceFormValues } from '@/api/post/postSource/types.ts';
import { SOURCE_URL } from '@/api/url';

export const postSource = async (
  sourceData: Omit<ISourceFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<ISourceFormValues> => {
  return await axios
    .post<ISourceFormValues>(SOURCE_URL, sourceData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};

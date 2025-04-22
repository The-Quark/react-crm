import axios from 'axios';
import { ISourceFormValues } from '@/api/post/postSource/types.ts';
import { SOURCE_URL } from '@/api/url';

export const putSource = async (
  id: number,
  languageData: Omit<ISourceFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<ISourceFormValues> => {
  return await axios
    .put<ISourceFormValues>(`${SOURCE_URL}?id=${id}`, languageData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};

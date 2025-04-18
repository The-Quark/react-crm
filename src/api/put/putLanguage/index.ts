import axios from 'axios';
import { ILanguageFormValues } from '@/api/post/postLanguage/types.ts';
import { LANGUAGE_URL } from '@/api/url';

export const putLanguage = async (
  id: number,
  languageData: Omit<ILanguageFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<ILanguageFormValues> => {
  return await axios
    .put<ILanguageFormValues>(`${LANGUAGE_URL}?id=${id}`, languageData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};

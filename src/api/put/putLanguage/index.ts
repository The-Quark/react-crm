import axios from 'axios';
import { ILanguageFormValues } from '@/api/post/postLanguage/types.ts';

const api = import.meta.env.VITE_APP_API_URL;
export const CREATE_LANGUAGE_URL = `${api}/language/manage`;

export const putLanguage = async (
  id: number,
  languageData: Omit<ILanguageFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<ILanguageFormValues> => {
  return await axios
    .post<ILanguageFormValues>(`${CREATE_LANGUAGE_URL}?id=${id}`, languageData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};

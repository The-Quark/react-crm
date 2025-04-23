import axios from 'axios';
import { ILanguageFormValues } from '@/api/post/postLanguage/types.ts';
import { LANGUAGE_URL } from '@/api/url';

export const postLanguage = async (
  data: Omit<ILanguageFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<ILanguageFormValues> => {
  return await axios
    .post<ILanguageFormValues>(LANGUAGE_URL, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};

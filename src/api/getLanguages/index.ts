import axios from 'axios';
import { LanguageResponse } from '@/api/getLanguages/types.ts';

const API_URL = import.meta.env.VITE_APP_API_URL;
const LANGUAGES_LIST_URL = `${API_URL}/language/manage`;

const getLanguages = async (): Promise<LanguageResponse> => {
  return await axios.get<LanguageResponse>(LANGUAGES_LIST_URL).then((res) => res.data);
};

export { getLanguages };

import axios from 'axios';
import { LanguageResponse } from '@/api/get/getGuides/getLanguages/types.ts';
import { LANGUAGE_URL } from '@/api/url';

const getLanguages = async (id?: number): Promise<LanguageResponse> => {
  return await axios
    .get<LanguageResponse>(id ? `${LANGUAGE_URL}?id=${id}` : LANGUAGE_URL)
    .then((res) => res.data);
};

export { getLanguages };

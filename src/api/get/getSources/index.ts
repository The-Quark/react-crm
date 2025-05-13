import axios from 'axios';
import { SOURCE_URL } from '@/api/url';
import { SourceResponse } from '@/api/get/getSources/types.ts';

const getSources = async (id?: number): Promise<SourceResponse> => {
  return await axios
    .get<SourceResponse>(id ? `${SOURCE_URL}?id=${id}` : SOURCE_URL)
    .then((res) => res.data);
};

export { getSources };

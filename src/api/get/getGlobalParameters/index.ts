import axios from 'axios';
import { ParametersListResponse } from '@/api/get/getGlobalParameters/types.ts';
import { COMPANY_GLOBAL_SETTINGS_URL } from '@/api/url';

const getGlobalParameters = async (id?: number): Promise<ParametersListResponse> => {
  return await axios
    .get<ParametersListResponse>(
      id ? `${COMPANY_GLOBAL_SETTINGS_URL}?id=${id}` : COMPANY_GLOBAL_SETTINGS_URL
    )
    .then((res) => res.data);
};

export { getGlobalParameters };

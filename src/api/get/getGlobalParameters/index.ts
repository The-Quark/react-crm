import axios from 'axios';
import { ParametersListResponse } from '@/api/get/getGlobalParameters/types.ts';

const API_URL = import.meta.env.VITE_APP_API_URL;
const PARAMETERS_LIST_URL = `${API_URL}/company-global-settings/manage`;

const getGlobalParameters = async (id?: number): Promise<ParametersListResponse> => {
  return await axios
    .get<ParametersListResponse>(id ? `${PARAMETERS_LIST_URL}?id=${id}` : PARAMETERS_LIST_URL)
    .then((res) => res.data);
};

export { getGlobalParameters };

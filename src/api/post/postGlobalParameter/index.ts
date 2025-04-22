import axios from 'axios';

interface IParameterFormValues {
  company_name: string;
  timezone: string;
  currency: string;
  language: string;
  legal_address: string;
  warehouse_address: string;
  airlines: string;
  dimensions_per_place: string;
  cost_per_airplace: number;
}

const api = import.meta.env.VITE_APP_API_URL;
export const CREATE_GLOBAL_PARAMS_URL = `${api}/company-global-settings/manage`;

export const postGlobalParameter = async (
  paramsData: Omit<IParameterFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IParameterFormValues> => {
  return await axios
    .post<IParameterFormValues>(CREATE_GLOBAL_PARAMS_URL, paramsData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};

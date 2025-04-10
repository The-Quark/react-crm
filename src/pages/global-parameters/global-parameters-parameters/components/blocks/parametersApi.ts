import axios from 'axios';

interface ParametersModel {
  id: number;
  company_name: string;
  timezone: string;
  currency: string;
  language: string;
  legal_address: string;
  warehouse_address: string;
  airlines: string;
  dimensions_per_place: string;
  cost_per_airplace: string;
  package_standard_box1: string | null;
  package_standard_box2: string | null;
  cost_package_box1: string | null;
  cost_package_box2: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}
interface ParametersListResponse {
  result: ParametersModel[];
  count: number;
}

const API_URL = import.meta.env.VITE_APP_API_URL;
const PARAMETERS_LIST_URL = `${API_URL}/company-global-settings/manage`;

const getParametersList = async (): Promise<ParametersListResponse> => {
  return await axios.get<ParametersListResponse>(PARAMETERS_LIST_URL).then((res) => res.data);
};

export { getParametersList };

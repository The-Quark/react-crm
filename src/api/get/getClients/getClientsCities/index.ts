import axios from 'axios';
import { CLIENT_CITIES_URL } from '@/api/url';
import { IClientsCitiesResponse } from '@/api/get/getClients/getClientsCities/types.ts';

export const getClientsCities = async (): Promise<IClientsCitiesResponse> => {
  return axios.get<IClientsCitiesResponse>(CLIENT_CITIES_URL).then((res) => res.data);
};

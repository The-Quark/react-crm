import axios from 'axios';
import { IClientResponse } from '@/api/get/getClients/types.ts';
import { CLIENT_URL } from '@/api/url';

const getClients = async (type?: 'legal' | 'individual'): Promise<IClientResponse> => {
  return await axios
    .get<IClientResponse>(type ? `${CLIENT_URL}?type=${type}` : CLIENT_URL)
    .then((res) => res.data);
};

export { getClients };

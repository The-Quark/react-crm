import axios from 'axios';
import { IClientResponse } from '@/api/get/getClients/types.ts';
import { CLIENT_URL } from '@/api/url';

const getClients = async (
  params?: { type: 'legal' | 'individual' } | { id: string }
): Promise<IClientResponse> => {
  let url = CLIENT_URL;

  if (params) {
    if ('type' in params) {
      url += `?type=${params.type}`;
    } else if ('id' in params) {
      url += `?id=${params.id}`;
    }
  }

  return await axios.get<IClientResponse>(url).then((res) => res.data);
};

export { getClients };

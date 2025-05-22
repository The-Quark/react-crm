import axios from 'axios';
import { PERMISSIONS_DISTRIBUTE } from '@/api/url';

interface IPermissionsDistributePayload {
  mode: 'give' | 'revoke';
  permissions: string[];
  role?: string;
  user_id?: number;
}

export const putPermissionsDistribute = async (
  payload: IPermissionsDistributePayload
): Promise<void> => {
  return await axios
    .put(PERMISSIONS_DISTRIBUTE, payload, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};

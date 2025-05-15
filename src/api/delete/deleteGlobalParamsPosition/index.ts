import axios from 'axios';
import { GLOBAL_PARAMS_POSITIONS } from '@/api/url';

export const deleteGlobalParamsPosition = async (id: number) => {
  try {
    await axios.delete(`${GLOBAL_PARAMS_POSITIONS}/?id=${id}`);
  } catch (error) {
    console.error('Error deleting position:', error);
  }
};

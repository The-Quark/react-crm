import axios from 'axios';
import { COMPANY_GLOBAL_SETTINGS_URL } from '@/api/url';

export const deleteGlobalParameter = async (id: number) => {
  try {
    await axios.delete(`${COMPANY_GLOBAL_SETTINGS_URL}/?id=${id}`);
  } catch (error) {
    console.error('Error deleting global parameter:', error);
  }
};

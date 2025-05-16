import axios from 'axios';
import { GLOBAL_PARAMS_DEPARTMENTS } from '@/api/url';

export const deleteGlobalParamsDepartments = async (id: number) => {
  try {
    await axios.delete(`${GLOBAL_PARAMS_DEPARTMENTS}/?id=${id}`);
  } catch (error) {
    console.error('Error deleting department:', error);
  }
};

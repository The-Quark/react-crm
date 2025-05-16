import axios from 'axios';
import { GLOBAL_PARAMS_SUBDIVISIONS } from '@/api/url';

export const deleteGlobalParamsSubdivision = async (id: number) => {
  try {
    await axios.delete(`${GLOBAL_PARAMS_SUBDIVISIONS}/?id=${id}`);
  } catch (error) {
    console.error('Error deleting subdivision:', error);
  }
};

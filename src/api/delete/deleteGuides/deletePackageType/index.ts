import axios from 'axios';
import { PACKAGE_TYPES_URL } from '@/api/url';

export const deletePackageType = async (id: number) => {
  try {
    await axios.delete(`${PACKAGE_TYPES_URL}/?id=${id}`);
  } catch (error) {
    console.error('Error deleting package type:', error);
  }
};

import axios from 'axios';
import { PACKAGE_URL } from '@/api/url';

export const deletePackage = async (id: number) => {
  try {
    await axios.delete(PACKAGE_URL, { params: { id } });
  } catch (error) {
    console.error('Error deleting package:', error);
    throw error;
  }
};

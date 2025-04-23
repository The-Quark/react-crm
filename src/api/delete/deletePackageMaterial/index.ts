import axios from 'axios';
import { PACKAGE_MATERIALS_URL } from '@/api/url';

export const deletePackageMaterial = async (id: number) => {
  try {
    await axios.delete(`${PACKAGE_MATERIALS_URL}/?id=${id}`);
  } catch (error) {
    console.error('Error deleting package material:', error);
  }
};

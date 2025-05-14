import axios from 'axios';
import { UNIT_URL } from '@/api/url';

export const deleteUnit = async (id: number) => {
  try {
    await axios.delete(`${UNIT_URL}/?id=${id}`);
  } catch (error) {
    console.error('Error deleting unit:', error);
  }
};

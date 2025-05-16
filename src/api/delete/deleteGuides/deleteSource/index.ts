import axios from 'axios';
import { SOURCE_URL } from '@/api/url';

export const deleteSource = async (id: number) => {
  try {
    await axios.delete(`${SOURCE_URL}/?id=${id}`);
  } catch (error) {
    console.error('Error deleting source:', error);
  }
};

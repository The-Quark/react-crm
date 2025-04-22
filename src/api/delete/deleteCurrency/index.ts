import axios from 'axios';
import { CURRENCY_URL } from '@/api/url';

export const deleteCurrency = async (id: number) => {
  try {
    await axios.delete(`${CURRENCY_URL}/?id=${id}`);
  } catch (error) {
    console.error('Error deleting currency:', error);
  }
};

import axios from 'axios';
import { TARIFFS } from '@/api/url';

export const deleteTariff = async (id: number) => {
  try {
    await axios.delete(`${TARIFFS}/?id=${id}`);
  } catch (error) {
    console.error('Error deleting tariff:', error);
  }
};

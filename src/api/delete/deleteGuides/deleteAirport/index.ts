import axios from 'axios';
import { AIRPORTS } from '@/api/url';

export const deleteAirport = async (id: number) => {
  try {
    await axios.delete(`${AIRPORTS}?id=${id}`);
  } catch (error) {
    console.error('Error deleting airport:', error);
  }
};

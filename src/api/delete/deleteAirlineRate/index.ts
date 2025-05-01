import axios from 'axios';
import { AIRLINE_RATE_URL } from '@/api/url';

export const deleteAirlineRate = async (id: number) => {
  try {
    await axios.delete(`${AIRLINE_RATE_URL}/?id=${id}`);
  } catch (error) {
    console.error('Error deleting airline rate:', error);
  }
};

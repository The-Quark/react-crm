import axios from 'axios';
import { AIRLINE_URL } from '@/api/url';

export const deleteAirline = async (id: number) => {
  try {
    await axios.delete(`${AIRLINE_URL}/?id=${id}`);
  } catch (error) {
    console.error('Error deleting airline:', error);
  }
};

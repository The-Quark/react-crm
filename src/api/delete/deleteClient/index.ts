import axios from 'axios';
import { CLIENT_URL } from '@/api/url';

export const deleteClient = async (id: number) => {
  try {
    await axios.delete(`${CLIENT_URL}?id=${id}`);
  } catch (error) {
    console.error('Error deleting client:', error);
  }
};

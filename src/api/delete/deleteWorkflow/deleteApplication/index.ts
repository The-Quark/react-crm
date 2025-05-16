import axios from 'axios';
import { APPLICATION_URL } from '@/api/url';

export const deleteApplication = async (id: number) => {
  try {
    await axios.delete(`${APPLICATION_URL}/?id=${id}`);
  } catch (error) {
    console.error('Error deleting application:', error);
  }
};

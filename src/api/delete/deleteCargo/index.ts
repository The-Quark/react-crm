import axios from 'axios';
import { CARGO_URL } from '@/api/url';

export const deleteCargo = async (id: number) => {
  try {
    await axios.delete(`${CARGO_URL}/?id=${id}`);
  } catch (error) {
    console.error('Error deleting cargo:', error);
  }
};

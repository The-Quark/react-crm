import axios from 'axios';
import { USERS_URL } from '@/api/url';

export const deleteUser = async (id: number) => {
  try {
    await axios.delete(`${USERS_URL}/?id=${id}`);
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

import axios from 'axios';
import { ORDER_URL } from '@/api/url';

export const deleteOrder = async (id: number) => {
  try {
    await axios.delete(`${ORDER_URL}/?id=${id}`);
  } catch (error) {
    console.error('Error deleting order:', error);
  }
};

import axios from 'axios';
import { DELIVERY_TYPES_URL } from '@/api/url';

export const deleteDeliveryType = async (id: number) => {
  try {
    await axios.delete(`${DELIVERY_TYPES_URL}/?id=${id}`);
  } catch (error) {
    console.error('Error deleting delivery type', error);
  }
};

import axios from 'axios';
import { TEMPLATE_URL } from '@/api/url';

export const deleteTemplate = async (id: number) => {
  try {
    await axios.delete(`${TEMPLATE_URL}/?id=${id}`);
  } catch (error) {
    console.error('Error deleting template:', error);
  }
};

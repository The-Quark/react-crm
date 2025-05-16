import axios from 'axios';
import { LANGUAGE_URL } from '@/api/url';

export const deleteLanguage = async (id: number) => {
  try {
    await axios.delete(`${LANGUAGE_URL}/?id=${id}`);
  } catch (error) {
    console.error('Error deleting language:', error);
  }
};

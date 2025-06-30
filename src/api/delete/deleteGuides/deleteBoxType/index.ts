import axios from 'axios';
import { BOX_TYPES } from '@/api/url';

export const deleteBoxType = async (id: number) => {
  try {
    await axios.delete(`${BOX_TYPES}/?id=${id}`);
  } catch (error) {
    console.error('Error deleting box type:', error);
  }
};

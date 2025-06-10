import axios from 'axios';
import { FILE_TYPE } from '@/api/url';

export const deleteFileType = async (id: number) => {
  try {
    await axios.delete(`${FILE_TYPE}/?id=${id}`);
  } catch (error) {
    console.error('Error deleting file type', error);
  }
};

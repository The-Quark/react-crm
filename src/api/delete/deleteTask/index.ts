import axios from 'axios';
import { TASK_URL } from '@/api/url';

export const deleteTask = async (id: number) => {
  try {
    await axios.delete(`${TASK_URL}/?id=${id}`);
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};

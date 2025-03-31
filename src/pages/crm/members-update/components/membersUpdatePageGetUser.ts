import axios from 'axios';
import { UserModel } from './types.ts';

const API_URL = import.meta.env.VITE_APP_API_URL;

export const getUser = async (id: number): Promise<UserModel> => {
  const USER_URL = `${API_URL}/users/manage?id=${id}`;
  try {
    const response = await axios.get(USER_URL);
    return response.data[0].result;
  } catch (err) {
    console.error('Ошибка запроса:', err);
    throw err;
  }
};

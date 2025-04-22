import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL;
const USER_DELETE_URL = `${API_URL}/users/manage`;

export const deleteUser = async (id: number) => {
  try {
    await axios.delete(`${USER_DELETE_URL}/?id=${id}`);
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

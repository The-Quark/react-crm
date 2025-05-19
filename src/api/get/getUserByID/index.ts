import axios from 'axios';
import { IGetUserByID } from '@/api/get/getUserByID/types.ts';
import { USERS_URL } from '@/api/url';

const getUserByID = async (id: number): Promise<IGetUserByID> => {
  return await axios.get<IGetUserByID>(`${USERS_URL}?id=${id}`).then((res) => res.data);
};

export { getUserByID };

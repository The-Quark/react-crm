import axios from 'axios';
import { USER_NOTIFICATIONS } from '@/api/url';
import { NotificationResponse } from '@/api/get/getUser/getUserNotifications/types.ts';

export const getUserNotifications = async (): Promise<NotificationResponse[]> => {
  return await axios.get<NotificationResponse[]>(USER_NOTIFICATIONS).then((res) => res.data);
};

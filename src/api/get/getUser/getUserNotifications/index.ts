import axios from 'axios';
import { USER_NOTIFICATIONS } from '@/api/url';
import { INotificationResponse } from '@/api/get/getUser/getUserNotifications/types.ts';
import { IPaginationParams } from '@/api/generalManualTypes';

interface IGetUserNotifications extends IPaginationParams {
  type: 'task' | 'application';
}

export const getUserNotifications = async ({
  type,
  page,
  per_page
}: IGetUserNotifications): Promise<INotificationResponse> => {
  const params = new URLSearchParams();
  if (type) params.append('type', type.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', (page + 1).toString());
  return await axios
    .get<INotificationResponse>(USER_NOTIFICATIONS, { params })
    .then((res) => res.data);
};

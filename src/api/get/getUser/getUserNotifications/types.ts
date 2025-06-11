import { IPagination } from '@/api/generalManualTypes';

export interface BaseNotificationData {
  message: string;
  type: string;
}

export interface TaskNotificationData extends BaseNotificationData {
  type: 'task';
  task_id: number;
  title: string;
  description: string;
}

export interface ApplicationNotificationData extends BaseNotificationData {
  type: 'application';
  application_id: number;
  full_name: string;
  phone: string;
}

export type NotificationData = (TaskNotificationData | ApplicationNotificationData) & {
  [key: string]: any;
};

export interface NotificationResponse {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: number;
  data: NotificationData;
  read_at: Date | null;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface INotificationResponse extends IPagination {
  result: NotificationResponse[];
}

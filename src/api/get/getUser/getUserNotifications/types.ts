export interface TaskNotificationData {
  task_id: number;
  title: string;
  description: string;
  message: string;
}

export interface NotificationResponse {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: number;
  data: TaskNotificationData;
  read_at: Date | null;
  created_at: Date | string;
  updated_at: Date | string;
}

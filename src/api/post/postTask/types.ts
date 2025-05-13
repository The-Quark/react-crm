import { TaskType, TaskPriority, TaskStatus } from '@/api/get/getTask/types';

export interface ITaskFormValues {
  title: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  assigned_by: number;
  assigned_to: number;
  order_id?: number;
  client_id?: number;
  package_id?: number;
  company_id?: number;
  due_date: string;
}

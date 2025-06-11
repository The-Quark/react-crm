import { TaskType, TaskPriority, TaskStatus } from '@/api/enums';

export interface ITaskFormValues {
  title?: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  status?: TaskStatus;
  assigned_by: number | string;
  assigned_to: number | string;
  order_id?: number | string;
  client_id?: number | string;
  package_id?: number | string;
  company_id?: number | string;
  due_date: string;
}

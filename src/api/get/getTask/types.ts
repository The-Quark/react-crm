import { TaskPriority, TaskStatus, TaskType } from '@/api/enums';
import { IPagination } from '@/api/generalManualTypes';
import { User } from '@/auth';
import { Order } from '@/api/get/getWorkflow/getOrder/types.ts';
import { Client } from '@/api/get/getClients/types.ts';
import { Package } from '@/api/get/getWorkflow/getPackages/types.ts';

export interface Task {
  id: number;
  title: string | null;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  assigned_by: User;
  assigned_to: User | null;
  order_id: number | null;
  client_id: number | null;
  package_id: number | null;
  company_id: number | null;
  due_date: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  order: Order | null;
  client: Client | null;
  package: Package | null;
}

export interface ITasksResponse extends IPagination {
  result: Task[];
}

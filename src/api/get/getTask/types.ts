import { TaskPriority, TaskStatus, TaskType } from '@/api/enums';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  patronymic: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  phone: string;
  position: string;
  location: string;
  avatar: string;
  last_login: string;
  last_ip: string;
  deleted_at: string | null;
}

interface Order {
  id: number;
  order_code: string;
  application_id: number;
  sender_id: number;
  receiver_id: number;
  delivery_type: number;
  package_type: number;
  weight: string;
  width: string;
  length: string;
  volume: string;
  places_count: number;
  customs_clearance: boolean;
  price: string;
  package_description: string | null;
  special_wishes: string | null;
  status: string;
  status_changed_at: string;
  client_id: number | null;
  created_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  delivery_category: string;
}

interface Client {
  id: number;
  type: string;
  phone: string;
  email: string;
  registered_at: string;
  notes: string | null;
  source_id: number;
  last_name: string;
  first_name: string;
  patronymic: string;
  birth_date: string;
  gender: string;
  company_name: string | null;
  business_type: string | null;
  bin: string | null;
  legal_address: string | null;
  representative_last_name: string | null;
  representative_first_name: string | null;
  representative_patronymic: string | null;
  representative_phone: string | null;
  representative_email: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  application_count: number;
  applications_packages_count: number;
}

interface Package {
  id: number;
  hawb: string;
  order_id: number;
  cargo_id: number | null;
  weight: string;
  dimensions: string;
  has_photo: boolean;
  has_invoice_pdf: boolean;
  document_count: number;
  photo_uploaded_at: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  client_id: number;
  status: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  assigned_by: User;
  assigned_to: User;
  order_id?: number;
  client_id?: number;
  package_id?: number;
  company_id?: number | null;
  due_date: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  order?: Order;
  client?: Client;
  package?: Package;
}

export interface ITasksResponse {
  result: Task[];
  count: number;
}

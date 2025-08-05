import { IPagination } from '@/api/generalManualTypes';
import { Package } from '@/api/get/getWorkflow/getPackages/types.ts';
import { Cargo } from '@/api/get/getWorkflow/getCargo/types.ts';
import { Application } from '@/api/get/getWorkflow/getApplications/types.ts';
import { Client } from '@/api/get/getClients/types.ts';

interface DeliveryType {
  id: number;
  name: string;
  description: string;
  icon: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface Source {
  id: number;
  code: string;
  name: string;
  is_active: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface PackageType {
  id: number;
  code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface User {
  id: number;
  name: string;
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

interface City {
  id: number;
  country_id: number;
  country_code: string;
  name: string;
  state_id: number;
}

interface Person {
  id: number;
  contact_id: number | null;
  full_name: string;
  first_name: string;
  last_name: string;
  patronymic: string | null;
  city_id: number;
  city: City | null;
  phone: string;
  street: string;
  house: string;
  apartment: string;
  location_description: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  type: 'legal' | 'individual';
  sender_type: 'legal' | 'individual';
  receiver_type: 'legal' | 'individual';
  company_name: string | null;
  bin: string | null;
}

export interface Order {
  id: number;
  contact_id: number;
  order_code: string;
  application_id: number | null;
  sender_id: number;
  is_express: boolean | null;
  receiver_id: number;
  delivery_type: DeliveryType;
  package_type: PackageType;
  weight: string;
  height: string;
  width: string;
  nominal_cost: string | null;
  length: string;
  volume: string;
  places_count: number;
  customs_clearance: boolean;
  package_description?: string;
  special_wishes?: string;
  status: string;
  status_changed_at: string;
  client_id: number | null;
  client: Client | null;
  created_by: User;
  is_international: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  delivery_category: string;
  application: Application | null;
  sender: Person;
  receiver: Person;
  source: Source | null;
  order_content?: string[];
  packages: Package[] | null;
  cargo: Cargo | null;
  hawb_pdf: string;
  is_draft: boolean;
  currency_code: string | null;
  currency_rate: string | null;
  price: string | null;
}

export interface IOrdersResponse extends IPagination {
  result: Order[];
}

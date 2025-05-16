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

interface Application {
  id: number;
  source_id: number;
  status: string;
  full_name: string;
  phone: string;
  email: string | null;
  message: string | null;
  processed_at: string | null;
  client_id: number | null;
  order_id: number | null;
  created_by: number;
  company_id: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface Person {
  id: number;
  contact_id: number | null;
  full_name: string;
  city_id: number;
  phone: string;
  street: string;
  house: string;
  apartment: string;
  location_description: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Order {
  id: number;
  contact_id: number;
  order_code: string;
  application_id: number;
  sender_id: number;
  receiver_id: number;
  delivery_type: DeliveryType;
  package_type: PackageType;
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
  created_by: User;
  is_international: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  delivery_category: string;
  application: Application;
  sender: Person;
  receiver: Person;
  source: Source | null;
}

export interface IOrdersResponse {
  result: Order[];
  count: number;
}

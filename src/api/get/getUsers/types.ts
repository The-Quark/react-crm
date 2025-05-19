import { UserCourierType, UserDriverStatus, UserStatus } from '@/api/enums';
import { Vehicle } from '@/api/get/getVehicles/types.ts';

interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  description: string | null;
  nicename: string | null;
  pivot: {
    model_type: string;
    model_id: number;
    role_id: number;
  };
}

interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  description: string | null;
  nicename: string | null;
  pivot: {
    model_type: string;
    model_id: number;
    permission_id: number;
  };
}

interface Company {
  id: number;
  company_name: string;
  timezone: string;
  currency: string;
  language: string;
  legal_address: string;
  warehouse_address: string;
  airlines: any[];
  dimensions_per_place: string;
  cost_per_airplace: string;
  package_standard_box1: string | null;
  package_standard_box2: string | null;
  cost_package_box1: string | null;
  cost_package_box2: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Department {
  id: number;
  company_id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  company: Company | null;
}

interface Language {
  id: number;
  created_at: string;
  updated_at: string;
  code: string;
  name: string;
  native_name: string;
  locale: string;
  direction: 'ltr' | 'rtl';
  is_active: boolean;
  deleted_at: string | null;
}

interface Subdivision {
  id: number;
  company_id: number;
  language_id: number;
  currency_id: number;
  name: string;
  legal_address: string;
  warehouse_address: string;
  timezone: string | null;
  is_active: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  company: Company;
  language: Language;
  currency: any;
}

interface UserModel {
  id: number;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  phone: string | null;
  position: string | null;
  location: string | null;
  avatar: string | null;
  last_login?: string | null;
  last_ip: string | null;
  deleted_at: string | null;
  last_seen: string;
  first_name: string;
  last_name: string;
  patronymic: string | null;
  birth_date: string | null;
  gender: 'male' | 'female' | 'other' | null;
  status: UserStatus;
  login: string;
  company_id: number | null;
  subdivision_id: number | null;
  department_id: number | null;
  position_id: number | null;
  license_category: string | null;
  vehicle_id: number | null;
  language_id: number | null;
  driver_status: UserDriverStatus | null;
  courier_type: UserCourierType | null;
  driver_details: any | null;
  roles: Role[];
  permissions: Permission[];
  can_register: boolean;
  company: Company | null;
  department: Department | null;
  subdivision: Subdivision | null;
  language: Language | null;
  vehicle: Vehicle | null;
}

export interface UsersResponse {
  result: UserModel;
  count: number;
}

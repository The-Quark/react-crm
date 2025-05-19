import { type TLanguageCode } from '@/i18n';

export interface AuthModel {
  token: string;
}

export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  description: string | null;
  nicename: string | null;
  pivot: {
    role_id: number;
    permission_id: number;
  };
}

export interface Role {
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

export interface User {
  id: number;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  phone: string;
  position: string | null;
  location: string | null;
  avatar: string | null;
  last_login: string;
  last_ip: string;
  deleted_at: string | null;
  last_seen: string;
  first_name: string;
  last_name: string;
  patronymic: string | null;
  birth_date: string | null;
  gender: string | null;
  status: string;
  login: string;
  company_id: number | null;
  subdivision_id: number | null;
  department_id: number | null;
  position_id: number | null;
  license_category: string | null;
  vehicle_id: number | null;
  language_id: number | null;
  driver_status: string | null;
  courier_type: string | null;
  driver_details: any | null;
  roles: Role[];
  permissions: Permission[];
  can_register: boolean;
  language?: TLanguageCode;
  auth?: AuthModel;
  company: any | null;
  department: any | null;
  subdivision: any | null;
  vehicle: any | null;
}

export interface UserModel {
  result: User;
  count: number;
}

export type UserResponse = UserModel;

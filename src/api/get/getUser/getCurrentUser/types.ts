import { Vehicle } from '@/api/get/getGuides/getVehicles/types.ts';
import { UserCourierType, UserDriverStatus, UserStatus } from '@/api/enums';

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
    role_id?: number;
    model_type?: string;
    model_id?: number;
    permission_id?: number;
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
  permissions?: Permission[];
}
export interface Country {
  id: number;
  iso2: string;
  name: string;
  status: number;
  phone_code: string;
  iso3: string;
  region: string;
  subregion: string;
}

export interface Location {
  id: number;
  country_id: number;
  state_id: number;
  name: string;
  country_code: string;
  country: Country;
}

export interface Position {
  id: number;
  company_id: number;
  title: string;
  description: string;
  is_active: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: number;
  company_id: number;
  name: string;
  description: string;
  is_active: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subdivision {
  id: number;
  company_id: number;
  language_id: number | null;
  currency_id: number | null;
  name: string;
  legal_address: string;
  warehouse_address: string;
  timezone: string;
  is_active: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: number;
  company_name: string;
  timezone: string;
  currency: string;
  language: string;
  legal_address: string;
  warehouse_address: string;
  dimensions_per_place: string;
  cost_per_airplace: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  airlines: any | null;
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

export interface User {
  id: number;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  phone: string;
  position: Position | null;
  location: Location | null;
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
  status_nicename: string;
  gender_nicename: string;
  courier_type_nicename: string;
  driver_status_nicename: string;
  role_nicanames: Array<Record<string, string>>;
  permission_nicenames: Array<Record<string, string>>;
  roles: Role[];
  permissions: Permission[];
  driver_status: UserDriverStatus | null;
  courier_type: UserCourierType | null;
  driver_details: any | null;
  company: Company | null;
  department: Department | null;
  subdivision: Subdivision | null;
  language: Language | null;
  vehicle: Vehicle | null;
  can_register?: boolean;
  auth?: AuthModel;
}

export interface UserModel {
  result: User;
  count: number;
}

export type UserResponse = UserModel;

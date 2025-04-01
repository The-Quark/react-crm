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
  roles: Role[];
  permissions: Permission[];
  can_register: boolean;
  language?: TLanguageCode;
  auth?: AuthModel;
}

export interface UserModel {
  result: User;
}

export type UserResponse = UserModel[];

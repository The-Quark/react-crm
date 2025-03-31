export interface UserModel {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  phone?: string | null;
  position?: string | null;
  location?: string | null;
  avatar?: string | null;
  last_login?: string | null;
  last_ip?: string | null;
  can_register: boolean;
}

import { IImageInputFile } from '@/components/image-input';
import { UserCourierType, UserDriverStatus, UserStatus } from '@/api/enums';

export interface UserModel {
  id: number;
  avatar?: IImageInputFile | null;
  position?: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  patronymic: string;
  birth_date: string;
  country_id: string;
  city_id: string;
  gender: 'male' | 'female' | 'other';
  status: UserStatus;
  login?: string;
  location: string;
  company_id: number | string;
  position_id: number | string;
  subdivision_id: number | string;
  department_id: number | string;
  license_category?: string;
  vehicle_id?: number | string;
  driver_status?: UserDriverStatus;
  courier_type?: UserCourierType;
  driver_details?: string;
}

import axios from 'axios';
import { UsersResponse } from '@/api/get/getUser/getUsers/types.ts';
import { USERS_URL } from '@/api/url';

export interface UsersFilterParams {
  id?: number;
  email?: string;
  phone?: string;
  position?: string;
  location?: string;
  status?: string;
  login?: string;
  language_id?: number;
  company_id?: number;
  subdivision_id?: number;
  department_id?: number;
  position_id?: number;
  license_category?: string;
  vehicle_id?: number;
  driver_status?: string;
  delivery_type?: string;
  first_name?: string;
  last_name?: string;
  patronymic?: string;
  driver_details?: string;
  name?: string;
  company_name?: string;
  language_code?: string;
}

export const getUsers = async (filters?: UsersFilterParams): Promise<UsersResponse> => {
  const params = new URLSearchParams();

  if (filters) {
    const strictFilters: (keyof UsersFilterParams)[] = [
      'id',
      'email',
      'phone',
      'position',
      'location',
      'status',
      'login',
      'language_id',
      'company_id',
      'subdivision_id',
      'department_id',
      'position_id',
      'license_category',
      'vehicle_id',
      'driver_status',
      'delivery_type'
    ];

    strictFilters.forEach((key) => {
      if (filters[key] !== undefined) {
        params.append(key, String(filters[key]));
      }
    });

    const likeFilters: (keyof UsersFilterParams)[] = [
      'first_name',
      'last_name',
      'patronymic',
      'driver_details'
    ];

    likeFilters.forEach((key) => {
      if (filters[key] !== undefined) {
        params.append(key, String(filters[key]));
      }
    });

    if (filters.name) {
      params.append('name', filters.name);
    }

    if (filters.company_name) {
      params.append('company_name', filters.company_name);
    }
    if (filters.language_code) {
      params.append('language_code', filters.language_code);
    }
  }

  return await axios.get<UsersResponse>(USERS_URL, { params }).then((res) => res.data);
};

import { VehicleStatus, VehicleType } from '@/api/enums';
import { IPagination } from '@/api/generalManualTypes';

export interface Vehicle {
  id: number;
  plate_number: string;
  type: VehicleType;
  brand: string;
  model: string;
  status: VehicleStatus;
  avg_fuel_consumption: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface VehiclesResponse extends IPagination {
  result: Vehicle[];
}

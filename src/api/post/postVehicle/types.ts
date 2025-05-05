import { VehicleStatus, VehicleType } from '@/api/get/getVehicles/types.ts';

export interface IVehicleFormValues {
  plate_number: string;
  type: VehicleType;
  brand: string;
  model: string;
  status: VehicleStatus;
  avg_fuel_consumption: string;
}

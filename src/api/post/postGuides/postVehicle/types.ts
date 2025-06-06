import { VehicleStatus, VehicleType } from '@/api/enums';

export interface IVehicleFormValues {
  plate_number: string;
  type: VehicleType;
  brand: string;
  model: string;
  status: VehicleStatus;
  avg_fuel_consumption: string;
}

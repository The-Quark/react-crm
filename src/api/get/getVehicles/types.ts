export enum VehicleType {
  AUTO = 'auto',
  VAN = 'van',
  MOTORBIKE = 'motorbike'
}
export enum VehicleStatus {
  ONLINE = 'on_line',
  SERVICE = 'on_service'
}
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

export interface VehiclesResponse {
  result: Vehicle[];
  count: number;
}

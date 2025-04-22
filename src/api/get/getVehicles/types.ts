export interface Vehicle {
  id: number;
  plate_number: string;
  type: 'car' | 'motorcycle' | 'truck' | 'bus';
  brand: string;
  model: string;
  status: 'available' | 'rented' | 'maintenance';
  avg_fuel_consumption: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface VehiclesResponse {
  result: Vehicle[];
  count: number;
}

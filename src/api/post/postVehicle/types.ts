export interface IVehicleFormValues {
  plate_number: string;
  type: 'car' | 'motorcycle' | 'truck' | 'bus';
  brand: string;
  model: string;
  status: 'available' | 'rented' | 'maintenance';
  avg_fuel_consumption: string;
}

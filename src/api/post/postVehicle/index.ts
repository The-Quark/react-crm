import axios from 'axios';
import { VEHICLE_URL } from '@/api/url';
import { IVehicleFormValues } from '@/api/post/postVehicle/types.ts';

export const postVehicle = async (
  vehicleData: Omit<IVehicleFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IVehicleFormValues> => {
  return await axios
    .post<IVehicleFormValues>(VEHICLE_URL, vehicleData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};

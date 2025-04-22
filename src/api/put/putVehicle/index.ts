import axios from 'axios';
import { IVehicleFormValues } from '@/api/post/postVehicle/types.ts';
import { VEHICLE_URL } from '@/api/url';

export const putVehicle = async (
  id: number,
  vehicleData: Omit<IVehicleFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IVehicleFormValues> => {
  return await axios
    .put<IVehicleFormValues>(`${VEHICLE_URL}?id=${id}`, vehicleData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};

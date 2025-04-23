import axios from 'axios';
import { IVehicleFormValues } from '@/api/post/postVehicle/types.ts';
import { VEHICLE_URL } from '@/api/url';

export const putVehicle = async (
  id: number,
  data: Omit<IVehicleFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IVehicleFormValues> => {
  return await axios
    .put<IVehicleFormValues>(`${VEHICLE_URL}?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};

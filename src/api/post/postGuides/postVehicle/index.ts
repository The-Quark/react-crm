import axios from 'axios';
import { VEHICLE_URL } from '@/api/url';
import { IVehicleFormValues } from '@/api/post/postGuides/postVehicle/types.ts';

export const postVehicle = async (
  data: Omit<IVehicleFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<IVehicleFormValues> => {
  return await axios
    .post<IVehicleFormValues>(VEHICLE_URL, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};

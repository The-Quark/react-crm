import axios from 'axios';
import { VEHICLE_URL } from '@/api/url';
import { VehiclesResponse } from '@/api/get/getGuides/getVehicles/types.ts';

const getVehicles = async (id?: number): Promise<VehiclesResponse> => {
  return await axios
    .get<VehiclesResponse>(id ? `${VEHICLE_URL}?id=${id}` : VEHICLE_URL)
    .then((res) => res.data);
};

export { getVehicles };

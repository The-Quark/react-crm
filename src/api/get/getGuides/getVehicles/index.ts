import axios from 'axios';
import { VEHICLE_URL } from '@/api/url';
import { VehiclesResponse } from '@/api/get/getGuides/getVehicles/types.ts';
import { IPaginationParams } from '@/api/generalManualTypes';

interface IGetVehicles extends IPaginationParams {
  id?: number;
  title?: string;
}

const getVehicles = async ({
  id,
  title,
  per_page,
  page
}: IGetVehicles): Promise<VehiclesResponse> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', page.toString());
  if (title) params.append('title', title);

  return await axios.get<VehiclesResponse>(VEHICLE_URL, { params }).then((res) => res.data);
};

export { getVehicles };

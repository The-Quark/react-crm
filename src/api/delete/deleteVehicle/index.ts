import axios from 'axios';
import { VEHICLE_URL } from '@/api/url';

export const deleteVehicle = async (id: number) => {
  try {
    await axios.delete(`${VEHICLE_URL}/?id=${id}`);
  } catch (error) {
    console.error('Error deleting vehicle:', error);
  }
};

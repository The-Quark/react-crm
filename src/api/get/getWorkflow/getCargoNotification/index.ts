import axios from 'axios';
import { CARGO_NOTIFICATIONS } from '@/api/url';
import { CargoNotificationsResponse } from '@/api/get/getWorkflow/getCargoNotification/types.ts';

const getCargoNotification = async (): Promise<CargoNotificationsResponse> => {
  return await axios.get<CargoNotificationsResponse>(CARGO_NOTIFICATIONS).then((res) => res.data);
};

export { getCargoNotification };

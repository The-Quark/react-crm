export interface CargoNotification {
  sender_city_id: number;
  sender_city_name: string;
  receiver_city_id: number;
  receiver_city_name: string;
  package_ids: number[];
  count: number;
}

export interface CargoNotificationsResponse {
  notifications: CargoNotification[];
}

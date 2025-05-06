interface Order {
  id: number;
  order_code: string;
  application_id: number;
  sender_id: number;
  receiver_id: number;
  delivery_type: number;
  package_type: number;
  weight: string;
  width: string;
  length: string;
  volume: string;
  places_count: number;
  customs_clearance: boolean;
  price: string;
  package_description: string | null;
  special_wishes: string | null;
  status: string;
  status_changed_at: string;
  client_id: number | null;
  created_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  delivery_category: string;
}
interface Client {
  id: number;
  type: 'individual' | 'legal';
  phone: string;
  email: string;
  registered_at: string;
  notes: string | null;
  source_id: number;
  last_name: string;
  first_name: string;
  patronymic: string;
  birth_date: string;
  gender: 'male' | 'female' | 'other';
  company_name: string | null;
  business_type: string | null;
  bin: string | null;
  legal_address: string | null;
  representative_last_name: string | null;
  representative_first_name: string | null;
  representative_patronymic: string | null;
  representative_phone: string | null;
  representative_email: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  application_count: number;
  applications_packages_count: number;
}
export enum PackageStatus {
  AWAITING_AIRPORT = 'awaiting_airport',
  READY_SEND = 'ready_send',
  READY_DELIVERY = 'ready_delivery',
  HEADING_CLIENT = 'heading_client',
  DONE_PACKAGING = 'done_packaging',
  IN_CARGO = 'in_cargo',
  AWAITING_CUSTOMS = 'awaiting_customs',
  READY_ODD = 'ready_odd',
  HEADING_ODD = 'heading_odd',
  ARRIVED_ODD = 'arrived_odd',
  ARRIVED_AIRPORT = 'arrived_airport',
  ARRIVED_WAREHOUSE = 'arrived_warehouse',
  ACCEPTED_WAREHOUSE = 'accepted_warehouse',
  PASSED_CUSTOMS = 'passed_customs',
  TRANSFERED_COURIER = 'transfered_courier',
  DELIVERED = 'delivered',
  REJECT_DAMAGED = 'rejected_damaged',
  REJECTED_CLIENT = 'rejected_client',
  REJECT_OTHER = 'rejected_other'
}
export interface Package {
  id: number;
  hawb: string;
  status: PackageStatus;
  order_id: number;
  cargo_id: number | null;
  weight: string;
  dimensions: string;
  has_photo: boolean;
  has_invoice_pdf: boolean;
  document_count: number;
  photo_uploaded_at: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  client_id: number;
  order: Order;
  cargo: any[];
  client: Client;
  media: any[];
  medias: any[];
}
export interface PackagesResponse {
  result: Package[];
  count: number;
}

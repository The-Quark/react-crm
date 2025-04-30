export interface IOrderFormValues {
  application_id: number | string;
  sender_id: number;
  receiver_id: number;
  delivery_type: number | string;
  delivery_category: 'b2b' | 'b2c' | 'c2c' | 'c2b';
  package_type: number | string;
  weight: number | string;
  width: number | string;
  length: number | string;
  volume?: number | string;
  places_count?: number | string;
  customs_clearance: boolean;
  price?: number | string;
  package_description?: string;
  special_wishes?: string;
  is_international: boolean;
}

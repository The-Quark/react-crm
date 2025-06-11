import { PackageStatus } from '@/api/enums';
import { IPagination } from '@/api/generalManualTypes';

interface Media {
  id: number;
  model_type: string;
  model_id: number;
  uuid: string;
  collection_name: string;
  name: string;
  file_name: string;
  mime_type: string;
  disk: string;
  conversions_disk: string;
  size: number;
  manipulations: any[];
  custom_properties: any[];
  generated_conversions: any[];
  responsive_images: any[];
  order_column: number;
  created_at: string;
  updated_at: string;
  original_url: string;
  preview_url: string;
  pivot?: {
    package_id: number;
    model_type: number;
  };
}

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
export interface Package {
  id: number;
  hawb: string;
  delivery_category: string;
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
  order: Order | null;
  cargo: any[];
  client: Client | null;
  media: Media[];
  medias: Media[];
  hawb_pdf: string;
}
export interface PackagesResponse extends IPagination {
  result: Package[];
}

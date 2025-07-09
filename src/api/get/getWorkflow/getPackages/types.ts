import { PackageStatus } from '@/api/enums';
import { IPagination } from '@/api/generalManualTypes';
import { User } from '@/api/get/getUser/getCurrentUser/types.ts';
import { Client } from '@/api/get/getClients/types.ts';
import { Order } from '@/api/get/getWorkflow/getOrder/types.ts';

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

export interface Package {
  id: number;
  hawb: string;
  box_height: string | null;
  box_length: string | null;
  box_width: string | null;
  box_type_id: string | null;
  assigned_user: User | null;
  delivery_category: string;
  status: PackageStatus;
  order_id: number;
  cargo_id: number | null;
  weight: string | null;
  width: string | null;
  length: string | null;
  height: string | null;
  volume: string | null;
  places_count: number | null;
  price: string | null;
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

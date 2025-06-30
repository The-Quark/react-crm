export interface IPackageFormValues {
  order_id: number | string;
  weight: number | string;
  width: number | string;
  length: number | string;
  height: number | string;
  volume?: number | string;
  places_count?: number | string;
  price?: number | string;
  dimensions?: string;
  frontcrm?: boolean;
  status?: string;
}

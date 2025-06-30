export interface IPackageFormValues {
  order_id: number | string;
  weight: number | string;
  width: number | string;
  length: number | string;
  height: number | string;
  volume?: number | string;
  box_height?: string | number;
  box_length?: string | number;
  box_width?: string | number;
  box_type_id?: string | number;
  places_count?: number | string;
  price?: number | string;
  dimensions?: string;
  frontcrm?: boolean;
  status?: string;
}

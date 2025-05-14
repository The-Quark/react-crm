export interface IPackageMaterialFormValues {
  code: string;
  name: string;
  unit_id: number | string;
  company_id: number[];
  price: number;
  description?: string;
  is_active: boolean;
}

export interface IPackageMaterialFormValues {
  code: string;
  name: string;
  unit_id: number | string;
  company_id: string[];
  price: number;
  description?: string;
  is_active: boolean;
}

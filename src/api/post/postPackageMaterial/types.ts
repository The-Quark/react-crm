export interface IPackageMaterialFormValues {
  code: string;
  name: string;
  unit_id: number | string;
  company_id: string[];
  price: string;
  description?: string;
  is_active: boolean;
}

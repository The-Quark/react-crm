import { IImageInputFile } from '@/components/image-input';

export interface UserModel {
  id: number;
  name: string;
  email: string;
  avatar?: IImageInputFile | null;
  phone?: string;
  location?: string;
  position?: string;
}

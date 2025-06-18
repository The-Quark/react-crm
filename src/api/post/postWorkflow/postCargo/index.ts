import axios from 'axios';
import { ICargoPostFormValues } from '@/api/post/postWorkflow/postCargo/types.ts';
import { CARGO_URL } from '@/api/url';
import { cleanValues } from '@/utils/lib/helpers.ts';

export const postCargo = async (
  data: Omit<ICargoPostFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<ICargoPostFormValues> => {
  const cleanedData = cleanValues(data);
  return await axios
    .post<ICargoPostFormValues>(CARGO_URL, cleanedData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};

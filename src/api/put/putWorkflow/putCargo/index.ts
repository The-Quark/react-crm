import axios from 'axios';
import { ICargoPostFormValues } from '@/api/post/postWorkflow/postCargo/types.ts';
import { CARGO_URL } from '@/api/url';

export const putCargo = async (
  id: number,
  data: Omit<ICargoPostFormValues, 'id' | 'created_at' | 'updated_at'>
): Promise<ICargoPostFormValues> => {
  return await axios
    .put<ICargoPostFormValues>(`${CARGO_URL}?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};

import axios from 'axios';
import { ITariffFormValues } from '@/api/post/postGuides/postTariff/types.ts';
import { TARIFFS } from '@/api/url';

export const putTariff = async (
  id: number,
  data: ITariffFormValues
): Promise<ITariffFormValues> => {
  return await axios
    .put<ITariffFormValues>(`${TARIFFS}/manage?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};

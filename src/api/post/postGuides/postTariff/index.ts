import axios from 'axios';
import { TARIFFS } from '@/api/url';
import { ITariffFormValues } from '@/api/post/postGuides/postTariff/types.ts';

export const postTariff = async (data: ITariffFormValues): Promise<ITariffFormValues> => {
  return await axios
    .post<ITariffFormValues>(TARIFFS, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};

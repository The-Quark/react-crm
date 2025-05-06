import axios from 'axios';
import { CargoResponse } from '@/api/get/getCargo/types.ts';
import { CARGO_URL } from '@/api/url';

const getCargo = async (id?: number): Promise<CargoResponse> => {
  return await axios
    .get<CargoResponse>(id ? `${CARGO_URL}?id=${id}` : CARGO_URL)
    .then((res) => res.data);
};

export { getCargo };

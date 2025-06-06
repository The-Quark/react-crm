import axios from 'axios';
import { UnitsResponse } from '@/api/get/getGuides/getUnits/types.ts';
import { UNIT_URL } from '@/api/url';

const getUnits = async (id?: number): Promise<UnitsResponse> => {
  return await axios
    .get<UnitsResponse>(id ? `${UNIT_URL}?id=${id}` : UNIT_URL)
    .then((res) => res.data);
};

export { getUnits };

import axios from 'axios';
import { UNIFIED_CREATE } from '@/api/url';
import { cleanValues } from '@/utils/lib/helpers.ts';
import { IFastFormFormValues } from '@/api/post/postWorkflow/postFastForm/types.ts';

export const postFastForm = async (data: IFastFormFormValues): Promise<IFastFormFormValues> => {
  const cleanedData = cleanValues(data);
  return await axios
    .post<IFastFormFormValues>(UNIFIED_CREATE, cleanedData, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};

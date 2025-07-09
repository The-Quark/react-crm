import axios from 'axios';
import { IApplicationPostFormValues } from '@/api/post/postWorkflow/postApplication/types.ts';
import { APPLICATION_URL } from '@/api/url';

export const postApplication = async (
  data: IApplicationPostFormValues
): Promise<IApplicationPostFormValues> => {
  return await axios
    .post<IApplicationPostFormValues>(APPLICATION_URL, (({ status, ...rest }) => rest)(data), {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};

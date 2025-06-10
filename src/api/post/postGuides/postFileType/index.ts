import axios from 'axios';
import { FILE_TYPE } from '@/api/url';
import { IFileTypeFormValues } from '@/api/post/postGuides/postFileType/types.ts';

export const postFileType = async (data: IFileTypeFormValues): Promise<IFileTypeFormValues> => {
  return await axios
    .post<IFileTypeFormValues>(FILE_TYPE, data, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.data);
};

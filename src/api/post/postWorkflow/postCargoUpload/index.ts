import axios from 'axios';
import { CARGO_UPLOAD_URL } from '@/api/url';
import { UploadType, ICargoUploadResponse } from '@/api/post/postWorkflow/postCargoUpload/types.ts';

export const postCargoUpload = async (
  id: number,
  type: UploadType,
  files: File[]
): Promise<ICargoUploadResponse> => {
  const formData = new FormData();
  formData.append('id', id.toString());
  formData.append('type', type);
  files.forEach((file) => {
    formData.append('upload[]', file);
  });
  return await axios
    .post<ICargoUploadResponse>(CARGO_UPLOAD_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json'
      }
    })
    .then((res) => res.data);
};

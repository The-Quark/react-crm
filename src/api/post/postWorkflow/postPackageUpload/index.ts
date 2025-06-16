import axios from 'axios';
import { PACKAGE_UPLOAD_URL } from '@/api/url';
import { IPackageUploadResponse } from '@/api/post/postWorkflow/postPackageUpload/types.ts';

export const postPackageUpload = async (
  id: number,
  type: string,
  files: File[]
): Promise<IPackageUploadResponse> => {
  const formData = new FormData();
  formData.append('id', id.toString());
  formData.append('type', type);
  files.forEach((file) => {
    formData.append('upload[]', file);
  });
  return await axios
    .post<IPackageUploadResponse>(PACKAGE_UPLOAD_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json'
      }
    })
    .then((res) => res.data);
};

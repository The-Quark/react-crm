import axios from 'axios';
import { TEMPLATE_UPLOAD_URL } from '@/api/url';
import {
  UploadType,
  ITemplateUploadResponse
} from '@/api/post/postGuides/postTemplateUpload/types.ts';

export const postTemplateUpload = async (
  id: number,
  type: string,
  files: File[],
  language_code: string
): Promise<ITemplateUploadResponse> => {
  const formData = new FormData();
  formData.append('template_id', id.toString());
  formData.append('type', type);
  formData.append('language_code', language_code);
  files.forEach((file) => {
    formData.append('upload[]', file);
  });
  return await axios
    .post<ITemplateUploadResponse>(TEMPLATE_UPLOAD_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json'
      }
    })
    .then((res) => res.data);
};

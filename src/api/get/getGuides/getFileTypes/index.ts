import axios from 'axios';
import { FILE_TYPE } from '@/api/url';
import { IPaginationParams } from '@/api/generalManualTypes';
import { FileTypesResponse } from '@/api/get/getGuides/getFileTypes/types.ts';

interface IGetFileTypes extends IPaginationParams {
  id?: number;
  name?: string;
  step?: string;
  cargo_id?: number;
  package_id?: number;
}

const getFileTypes = async ({
  id,
  name,
  step,
  per_page,
  page,
  cargo_id,
  package_id
}: IGetFileTypes): Promise<FileTypesResponse> => {
  const params = new URLSearchParams();

  if (id) params.append('id', id.toString());
  if (cargo_id) params.append('cargo_id', cargo_id.toString());
  if (package_id) params.append('package_id', package_id.toString());
  if (per_page) params.append('per_page', per_page.toString());
  if (page) params.append('page', page.toString());
  if (name) params.append('name', name.toString());
  if (step) params.append('step', step.toString());

  return await axios.get<FileTypesResponse>(FILE_TYPE, { params }).then((res) => res.data);
};

export { getFileTypes };

import axios from 'axios';
import { AUDIT_LOG } from '@/api/url';
import { IAuditLogResponse } from '@/api/get/getAuditLog/types.ts';

interface IGetAuditLogParams {
  entity_type: 'Application' | 'Order' | 'Package' | 'Cargo';
  entity_id: number;
}

const getAuditLog = async ({
  entity_type,
  entity_id
}: IGetAuditLogParams): Promise<IAuditLogResponse> => {
  const params = new URLSearchParams();

  if (entity_type)
    params.append('entity_type', entity_type.charAt(0).toUpperCase() + entity_type.slice(1));
  if (entity_id) params.append('entity_id', entity_id.toString());

  return axios.get<IAuditLogResponse>(AUDIT_LOG, { params }).then((res) => res.data);
};

export { getAuditLog };

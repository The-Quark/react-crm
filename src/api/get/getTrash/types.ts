import { IPagination } from '@/api/generalManualTypes';
import { Order } from '@/api/get/getWorkflow/getOrder/types.ts';
import { Package } from '@/api/get/getWorkflow/getPackages/types.ts';
import { Cargo } from '@/api/get/getWorkflow/getCargo/types.ts';
import { Application } from '@/api/get/getWorkflow/getApplications/types.ts';

export interface ITrashResponse extends IPagination {
  result: Cargo[] | Order[] | Package[] | Application[];
}

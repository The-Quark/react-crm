import { IOrderFormValues } from '@/api/post/postWorkflow/postOrder/types.ts';
import { ISenderOrderFormValues } from '@/api/post/postWorkflow/postOrderSender/types.ts';
import { IReceiverOrderFormValues } from '@/api/post/postWorkflow/postOrderReceiver/types.ts';

interface Application {
  source: string;
  company_name?: string;
  bin?: string;
  first_name?: string;
  last_name?: string;
  patronymic?: string;
  client_type: 'individual' | 'legal';
  phone: string;
  client_id?: number | null | string;
  email?: string | null;
  message?: string | null;
  status?: string;
}
interface IOrderWithRelationsFormValues extends IOrderFormValues {
  sender?: ISenderOrderFormValues;
  receiver?: IReceiverOrderFormValues;
}

export interface IFastFormFormValues {
  application: Application;
  order?: IOrderWithRelationsFormValues;
}

import React, { FC } from 'react';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog.tsx';
import { KeenIcon } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { getOrders } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { setData } from '@/utils/include/LocalStorage';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';

interface Props {
  open: boolean;
  id: number | null;
  handleClose: () => void;
}

export const OrdersModal: FC<Props> = ({ open, id, handleClose }) => {
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManage = has('manage orders') || currentUser?.roles[0].name === 'superadmin';
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => (id !== null ? getOrders(id) : Promise.reject('Invalid ID'))
  });
  const navigate = useNavigate();
  const order = data?.result?.[0];

  const handleClick = (orderId: number) => {
    setData('orderIdFromOrders', orderId);
    navigate('/tasks/starter');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="container-fixed max-w-screen-md p-0 [&>button]:hidden">
        <DialogHeader className="modal-rounded-t p-0 border-0 relative min-h-20 flex flex-col items-stretch justify-end bg-center bg-cover bg-no-repeat modal-bg">
          <DialogTitle className="absolute top-0 text-1.5xl ml-4 mt-3">Order Details</DialogTitle>
          <button
            className="btn btn-sm btn-icon btn-light btn-outline absolute top-0 end-0 me-3 mt-3 lg:me-3 shadow-default"
            data-modal-dismiss="true"
            onClick={handleClose}
          >
            <KeenIcon icon="cross" />
          </button>
        </DialogHeader>
        <DialogBody className="py-0 mb-5 ps-5 pe-3 me-3">
          {isLoading && <SharedLoading />}
          {isError && <SharedError error={error} />}
          {order && (
            <div className="card pb-2.5">
              <div className="card-body grid gap-5">
                {/* Sender Block */}
                <div className="border-b pb-4">
                  <h4 className="text-lg font-semibold mb-3">Sender Information</h4>
                  <div className="grid gap-2.5">
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Full Name</label>
                      <div className="flex columns-1 w-full">{order.sender.full_name || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Phone</label>
                      <div className="flex columns-1 w-full">{order.sender.phone || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Address</label>
                      <div className="flex columns-1 w-full">
                        {`${order.sender.street || ''}, ${order.sender.house || ''}, Apt ${
                          order.sender.apartment || ''
                        }, City ID: ${order.sender.city_id || '-'}`}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Notes</label>
                      <div className="flex columns-1 w-full">{order.sender.notes || '-'}</div>
                    </div>
                  </div>
                </div>

                {/* Receiver Block */}
                <div className="border-b pb-4">
                  <h4 className="text-lg font-semibold mb-3">Receiver Information</h4>
                  <div className="grid gap-2.5">
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Full Name</label>
                      <div className="flex columns-1 w-full">{order.receiver.full_name || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Phone</label>
                      <div className="flex columns-1 w-full">{order.receiver.phone || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Address</label>
                      <div className="flex columns-1 w-full">
                        {`${order.receiver.street || ''}, ${order.receiver.house || ''}, Apt ${
                          order.receiver.apartment || ''
                        }, City ID: ${order.receiver.city_id || '-'}`}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Notes</label>
                      <div className="flex columns-1 w-full">{order.receiver.notes || '-'}</div>
                    </div>
                  </div>
                </div>

                {/* Application Block */}
                <div className="border-b pb-4">
                  <h4 className="text-lg font-semibold mb-3">Application Information</h4>
                  <div className="grid gap-2.5">
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Full Name</label>
                      <div className="flex columns-1 w-full">
                        {order.application.full_name || '-'}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Phone</label>
                      <div className="flex columns-1 w-full">{order.application.phone || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Status</label>
                      <div className="flex columns-1 w-full">{order.application.status || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Created At</label>
                      <div className="flex columns-1 w-full">
                        {order.application.created_at
                          ? new Date(order.application.created_at).toLocaleDateString('ru-RU')
                          : '-'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Block */}
                <div>
                  <h4 className="text-lg font-semibold mb-3">Order Information</h4>
                  <div className="grid gap-2.5">
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Order Code</label>
                      <div className="flex columns-1 w-full">{order.order_code || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Delivery Type</label>
                      <div className="flex columns-1 w-full">{order.delivery_type.name || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Package Type</label>
                      <div className="flex columns-1 w-full">{order.package_type.code || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Status</label>
                      <div className="flex columns-1 w-full">{order.status || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Weight</label>
                      <div className="flex columns-1 w-full">{order.weight || '-'} kg</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Dimensions</label>
                      <div className="flex columns-1 w-full">
                        {`${order.width || '-'} x ${order.length || '-'} x ${order.volume || '-'} cm`}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Price</label>
                      <div className="flex columns-1 w-full">{order.price || '-'} USD</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Created At</label>
                      <div className="flex columns-1 w-full">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString('ru-RU')
                          : '-'}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Delivery Category</label>
                      <div className="flex columns-1 w-full">{order.delivery_category || '-'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogBody>
        {canManage && (
          <DialogActions>
            <a
              className="btn btn-md btn-light mr-3 mb-3"
              href={`/call-center/orders/starter/${id}`}
            >
              Update Order
            </a>
            <button
              className="btn btn-md btn-primary mr-3 mb-3"
              onClick={() => id !== null && handleClick(id)}
            >
              Create Task
            </button>
          </DialogActions>
        )}
      </DialogContent>
    </Dialog>
  );
};

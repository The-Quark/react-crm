import React, { FC } from 'react';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog.tsx';
import { KeenIcon } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { getOrders } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { useIntl } from 'react-intl';
import { OrderStatus } from '@/api/enums';

interface Props {
  open: boolean;
  id: number | null;
  handleClose: () => void;
}

export const OrdersModal: FC<Props> = ({ open, id, handleClose }) => {
  const { formatMessage } = useIntl();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const navigate = useNavigate();
  const canManage = has('manage orders') || currentUser?.roles[0].name === 'superadmin';

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => (id !== null ? getOrders({ id: Number(id) }) : Promise.reject('Invalid ID'))
  });

  const order = data?.result?.[0];
  const url = order?.hawb_pdf.startsWith('http') ? order.hawb_pdf : `https://${order?.hawb_pdf}`;

  const handleOrderToPackage = (orderId: number | null) => {
    if (orderId !== null) {
      navigate(`/warehouse/packages/starter?order_id=${orderId}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="container-fixed max-w-screen-md p-0 [&>button]:hidden">
        <DialogHeader className="modal-rounded-t p-0 border-0 relative min-h-20 flex flex-col items-stretch justify-end bg-center bg-cover bg-no-repeat modal-bg">
          <DialogTitle className="absolute top-0 text-1.5xl ml-4 mt-3">
            {formatMessage({ id: 'SYSTEM.ORDER_DETAILS' })}
          </DialogTitle>
          <DialogDescription />
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
                  <h4 className="text-lg font-semibold mb-3">
                    {formatMessage({ id: 'SYSTEM.SENDER_INFO' })}
                  </h4>
                  <div className="grid gap-2.5">
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.FULL_NAME' })}
                      </label>
                      <div className="flex columns-1 w-full">{order.sender.full_name || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.PHONE' })}
                      </label>
                      <div className="flex columns-1 w-full">{order.sender.phone || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.CITY' })}
                      </label>
                      <div className="flex columns-1 w-full">{order.sender.city?.name || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.STREET' })}
                      </label>
                      <div className="flex columns-1 w-full">{order.sender?.street || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.HOUSE' })}
                      </label>
                      <div className="flex columns-1 w-full">{order.sender?.house || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.APARTMENT' })}
                      </label>
                      <div className="flex columns-1 w-full">{order.sender?.apartment || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.NOTES' })}
                      </label>
                      <div className="flex columns-1 w-full">{order.sender.notes || '-'}</div>
                    </div>
                  </div>
                </div>

                {/* Receiver Block */}
                <div className="border-b pb-4">
                  <h4 className="text-lg font-semibold mb-3">
                    {formatMessage({ id: 'SYSTEM.RECEIVER_INFO' })}
                  </h4>
                  <div className="grid gap-2.5">
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.FULL_NAME' })}
                      </label>
                      <div className="flex columns-1 w-full">{order.receiver.full_name || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.PHONE' })}
                      </label>
                      <div className="flex columns-1 w-full">{order.receiver.phone || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.CITY' })}
                      </label>
                      <div className="flex columns-1 w-full">
                        {order.receiver.city?.name || '-'}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.STREET' })}
                      </label>
                      <div className="flex columns-1 w-full">{order.receiver?.street || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.HOUSE' })}
                      </label>
                      <div className="flex columns-1 w-full">{order.receiver?.house || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.APARTMENT' })}
                      </label>
                      <div className="flex columns-1 w-full">
                        {order.receiver?.apartment || '-'}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.NOTES' })}
                      </label>
                      <div className="flex columns-1 w-full">{order.receiver.notes || '-'}</div>
                    </div>
                  </div>
                </div>

                {/* Application Block */}
                {order.application && (
                  <div className="border-b pb-4">
                    <h4 className="text-lg font-semibold mb-3">
                      {formatMessage({ id: 'SYSTEM.APPLICATION_INFO' })}
                    </h4>
                    <div className="grid gap-2.5">
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {formatMessage({ id: 'SYSTEM.FULL_NAME' })}
                        </label>
                        <div className="flex columns-1 w-full">
                          {order.application.full_name || '-'}
                        </div>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {formatMessage({ id: 'SYSTEM.PHONE' })}
                        </label>
                        <div className="flex columns-1 w-full">
                          {order.application.phone || '-'}
                        </div>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {formatMessage({ id: 'SYSTEM.STATUS' })}
                        </label>
                        <div className="flex columns-1 w-full">
                          {order.application.status || '-'}
                        </div>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {formatMessage({ id: 'SYSTEM.CREATED_AT' })}
                        </label>
                        <div className="flex columns-1 w-full">
                          {order.application.created_at
                            ? new Date(order.application.created_at).toLocaleDateString('ru-RU')
                            : '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Block */}
                <div className="border-b pb-4">
                  <h4 className="text-lg font-semibold mb-3">
                    {formatMessage({ id: 'SYSTEM.ORDER_INFO' })}
                  </h4>
                  <div className="grid gap-2.5">
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.ORDER_CODE' })}
                      </label>
                      <div className="flex columns-1 w-full">{order.order_code || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.DELIVERY_TYPE' })}
                      </label>
                      <div className="flex columns-1 w-full">
                        {order?.delivery_type?.name || '-'}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.DELIVERY_CATEGORY' })}
                      </label>
                      <div className="flex columns-1 w-full">{order.delivery_category || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.IS_EXPRESS' })}
                      </label>
                      <div className="flex columns-1 w-full">
                        {formatMessage({
                          id: order.is_express ? 'SYSTEM.ENABLED' : 'SYSTEM.DISABLED'
                        })}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.INTERNATIONAL' })}
                      </label>
                      <div className="flex columns-1 w-full">
                        {formatMessage({
                          id: order.is_international ? 'SYSTEM.ENABLED' : 'SYSTEM.DISABLED'
                        })}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.PACKAGE_TYPE' })}
                      </label>
                      <div className="flex columns-1 w-full">{order.package_type.code || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.ORDER_CONTENT' })}
                      </label>
                      <div className="flex columns-1 w-full">
                        {order.order_content?.map((index) => index) || '-'}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.CUSTOMS_CLEARANCE' })}
                      </label>
                      <div className="flex columns-1 w-full">
                        {formatMessage({
                          id: order?.customs_clearance ? 'SYSTEM.ENABLED' : 'SYSTEM.DISABLED'
                        })}
                      </div>
                    </div>
                    {order?.customs_clearance && (
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {formatMessage({ id: 'SYSTEM.NOMINAL_COST' })}
                        </label>
                        <div className="flex columns-1 w-full">
                          {order?.nominal_cost || '-'} {` (USD)`}
                        </div>
                      </div>
                    )}
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.WEIGHT' })}
                      </label>
                      <div className="flex columns-1 w-full">{order.weight || '-'} kg</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.DIMENSIONS' })}
                      </label>
                      <div className="flex columns-1 w-full">
                        {`${order.width || '-'} x ${order.length || '-'} x ${order.volume || '-'} cm`}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.PRICE' })}
                      </label>
                      <div className="flex columns-1 w-full">{order.price || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.PACKAGE_DESCRIPTION' })}
                      </label>
                      <div className="flex columns-1 w-full">
                        {order?.package_description || '-'}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.SPECIAL_WISHES' })}
                      </label>
                      <div className="flex columns-1 w-full">{order?.special_wishes || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.STATUS' })}
                      </label>
                      <div className="flex columns-1 w-full">{order.status || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.CREATED_AT' })}
                      </label>
                      <div className="flex columns-1 w-full">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString('ru-RU')
                          : '-'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Package Block */}
                {order.packages && order.packages.length > 0 && (
                  <div className="border-b pb-4">
                    <h4 className="text-lg font-semibold mb-3">
                      {formatMessage({ id: 'SYSTEM.PACKAGE_INFO' })}
                    </h4>
                    <div className="grid gap-2.5">
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {formatMessage({ id: 'SYSTEM.HAWB' })}
                        </label>
                        <a
                          className="link"
                          href={`/warehouse/packages/list/id=${order.packages[0].id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {order.packages[0].hawb || '-'}
                        </a>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {formatMessage({ id: 'SYSTEM.STATUS' })}
                        </label>
                        <div className="flex columns-1 w-full">
                          {order.packages[0].status || '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cargo Block */}
                {order.cargo && (
                  <div className="border-b pb-4">
                    <h4 className="text-lg font-semibold mb-3">
                      {formatMessage({ id: 'SYSTEM.CARGO_INFO' })}
                    </h4>
                    <div className="grid gap-2.5">
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {formatMessage({ id: 'SYSTEM.MAWB' })}
                        </label>
                        <a
                          className="link"
                          href={`/warehouse/cargo/list/id=${order.cargo.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {order.cargo.code || '-'}
                        </a>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {formatMessage({ id: 'SYSTEM.STATUS' })}
                        </label>
                        <div className="flex columns-1 w-full">{order.cargo.status || '-'}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* QR Code Block */}
                <div>
                  <h4 className="text-lg font-semibold mb-3">
                    {formatMessage({ id: 'SYSTEM.QR_CODE' })}
                  </h4>
                  <div className="flex flex-col items-start">
                    {order.hawb_pdf ? (
                      <>
                        <img
                          src={url}
                          alt="Order QR Code"
                          className="w-48 h-48 object-contain border border-gray-200 rounded-lg p-2"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.outerHTML = `
                              <div class="text-red-500 text-center">
                                ${formatMessage({ id: 'SYSTEM.QR_CODE_LOAD_ERROR' })} 
                                <a href="${url}" target="_blank" rel="noopener noreferrer" class="link ml-1">
                                  ${formatMessage({ id: 'SYSTEM.OPEN_DIRECTLY' })}
                                </a>
                              </div>`;
                          }}
                        />
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 text-sm text-blue-600 hover:underline"
                        >
                          {formatMessage({ id: 'SYSTEM.DOWNLOAD_QR' })}
                        </a>
                      </>
                    ) : (
                      <div className="text-gray-500">{formatMessage({ id: 'SYSTEM.NO_QR' })}</div>
                    )}
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
              {formatMessage({ id: 'SYSTEM.UPDATE_ORDER' })}
            </a>
            {order?.status === OrderStatus.PACKAGE_AWAITING && (
              <button
                className="btn btn-md btn-primary mr-3 mb-3"
                onClick={() => handleOrderToPackage(id)}
              >
                {formatMessage({ id: 'SYSTEM.CREATE_PACKAGE' })}
              </button>
            )}
          </DialogActions>
        )}
      </DialogContent>
    </Dialog>
  );
};

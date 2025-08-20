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
import { useIntl } from 'react-intl';

interface Props {
  open: boolean;
  id: number | null;
  handleClose: () => void;
}

export const OrdersQrModal: FC<Props> = ({ open, id, handleClose }) => {
  const { formatMessage } = useIntl();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => (id !== null ? getOrders({ id: Number(id) }) : Promise.reject('Invalid ID'))
  });

  const order = data?.result?.[0];
  const url = order?.hawb_pdf.startsWith('http') ? order.hawb_pdf : `https://${order?.hawb_pdf}`;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="container-fixed max-w-screen-sm p-0 [&>button]:hidden">
        <DialogHeader className="modal-rounded-t p-0 border-0 relative min-h-20 flex flex-col items-stretch justify-end bg-center bg-cover bg-no-repeat modal-bg">
          <DialogTitle className="absolute top-0 text-1.5xl ml-4 mt-3">
            {formatMessage({ id: 'SYSTEM.QR_CODE' })}
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
                <div className="flex flex-col justify-center items-center">
                  {order.hawb_pdf ? (
                    <>
                      <img
                        src={url}
                        alt="Order QR Code"
                        className="w-80 h-80 object-contain"
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
                        className="mt-2 text-md text-blue-600 hover:underline"
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
          )}
        </DialogBody>
        <DialogActions />
      </DialogContent>
    </Dialog>
  );
};

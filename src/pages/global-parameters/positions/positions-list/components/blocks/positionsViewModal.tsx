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
import { getGlobalParamsPositions } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { DialogActions } from '@mui/material';
import { useIntl } from 'react-intl';

interface Props {
  open: boolean;
  id: number | null;
  handleClose: () => void;
  handleFormClick: (id: number | null) => void;
}

export const PositionsViewModal: FC<Props> = ({ open, id, handleClose, handleFormClick }) => {
  const { formatMessage } = useIntl();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['position', id],
    queryFn: () =>
      id !== null ? getGlobalParamsPositions({ id: Number(id) }) : Promise.reject('Invalid ID'),
    gcTime: 0,
    staleTime: 0,
    refetchOnMount: true
  });

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="container-fixed max-w-screen-md p-0 [&>button]:hidden">
        <DialogHeader className="modal-rounded-t p-0 border-0 relative min-h-20 flex flex-col items-stretch justify-end bg-center bg-cover bg-no-repeat modal-bg">
          <DialogTitle className="absolute top-0 text-1.5xl ml-4 mt-3">
            {formatMessage({ id: 'SYSTEM.POSITION_DETAILS' })}
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
          {isLoading && <SharedLoading simple />}
          {isError && <SharedError error={error} />}
          {data?.result && (
            <div className="card pb-2.5">
              <div className="card-body grid gap-5">
                <div className="border-b pb-4">
                  <h4 className="text-lg font-semibold mb-4">
                    {formatMessage({ id: 'SYSTEM.POSITION_INFO' })}
                  </h4>
                  <div className="grid gap-3">
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 tex">
                        {formatMessage({ id: 'SYSTEM.POSITION' })}
                      </label>
                      <div className="flex columns-1 w-full flex-wrap ">{data.result[0].title}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56">
                        {formatMessage({ id: 'SYSTEM.DESCRIPTION' })}
                      </label>
                      <div className="flex columns-1 w-full flex-wrap">
                        {data.result[0].description}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56">
                        {formatMessage({ id: 'SYSTEM.IS_ACTIVE' })}
                      </label>
                      <div className="flex columns-1 w-full flex-wrap">
                        {data.result[0].is_active
                          ? formatMessage({ id: 'SYSTEM.ENABLED' })
                          : formatMessage({ id: 'SYSTEM.DISABLED' })}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56">
                        {formatMessage({ id: 'SYSTEM.CREATED_AT' })}
                      </label>
                      <div className="flex columns-1 w-full flex-wrap">
                        {data.result[0].created_at}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-4">
                    {formatMessage({ id: 'SYSTEM.COMPANY_INFO' })}
                  </h4>
                  <div className="grid gap-2.5">
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.COMPANY' })}
                      </label>
                      <div className="flex columns-1 w-full">
                        {data.result[0].company?.company_name || '-'}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.CURRENCY' })}
                      </label>
                      <div className="flex columns-1 w-full">
                        {data.result[0].company?.currency || '-'}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.LANGUAGE' })}
                      </label>
                      <div className="flex columns-1 w-full">
                        {data.result[0].company?.language || '-'}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.TIMEZONE' })}
                      </label>
                      <div className="flex columns-1 w-full">
                        {data.result[0].company?.timezone || '-'}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.LEGAL_ADDRESS' })}
                      </label>
                      <div className="flex columns-1 w-full">
                        {data.result[0].company?.legal_address || '-'}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.WAREHOUSE_ADDRESS' })}
                      </label>
                      <div className="flex columns-1 w-full">
                        {data.result[0].company?.warehouse_address || '-'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogBody>

        <DialogActions>
          <button
            className="btn btn-md btn-primary m-3"
            disabled={id === null}
            onClick={() => handleFormClick(id)}
          >
            {formatMessage({ id: 'SYSTEM.EDIT' })}
          </button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

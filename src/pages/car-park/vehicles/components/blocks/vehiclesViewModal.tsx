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
import { getVehicles } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { DialogActions } from '@mui/material';
import { useIntl } from 'react-intl';

interface Props {
  open: boolean;
  id: number | null;
  handleClose: () => void;
  handleFormClick: (id: number | null) => void;
}

export const VehiclesViewModal: FC<Props> = ({ open, id, handleClose, handleFormClick }) => {
  const { formatMessage } = useIntl();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => (id !== null ? getVehicles({ id: Number(id) }) : Promise.reject('Invalid ID')),
    gcTime: 0,
    staleTime: 0,
    refetchOnMount: true
  });

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="container-fixed max-w-screen-md p-0 [&>button]:hidden">
        <DialogHeader className="modal-rounded-t p-0 border-0 relative min-h-20 flex flex-col items-stretch justify-end bg-center bg-cover bg-no-repeat modal-bg">
          <DialogTitle className="absolute top-0 text-1.5xl ml-4 mt-3">
            {formatMessage({ id: 'SYSTEM.VEHICLE_DETAILS' })}
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
          <div className="card pb-2.5">
            {isLoading && <SharedLoading simple />}
            {isError && <SharedError error={error} />}
            {data?.result && (
              <div className="card-body grid gap-5">
                <div className="">
                  <h4 className="text-lg font-semibold mb-4">
                    {formatMessage({ id: 'SYSTEM.VEHICLE' })}
                  </h4>
                  <div className="grid gap-3">
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 tex">
                        {formatMessage({ id: 'SYSTEM.PLATE_NUMBER' })}
                      </label>
                      <div className="flex columns-1 w-full flex-wrap ">
                        {data.result[0].plate_number}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56">
                        {formatMessage({ id: 'SYSTEM.TYPE' })}
                      </label>
                      <div className="flex columns-1 w-full flex-wrap">{data.result[0].type}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56">
                        {formatMessage({ id: 'SYSTEM.BRAND' })}
                      </label>
                      <div className="flex columns-1 w-full flex-wrap">{data.result[0].brand}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56">
                        {formatMessage({ id: 'SYSTEM.MODEL' })}
                      </label>
                      <div className="flex columns-1 w-full flex-wrap">{data.result[0].model}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56">
                        {formatMessage({ id: 'SYSTEM.SELECT_STATUS' })}
                      </label>
                      <div className="flex columns-1 w-full flex-wrap">{data.result[0].status}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56">
                        {formatMessage({ id: 'SYSTEM.AVERAGE_FUEL_CONSUMPTION' })}
                      </label>
                      <div className="flex columns-1 w-full flex-wrap">
                        {data.result[0].avg_fuel_consumption}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
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

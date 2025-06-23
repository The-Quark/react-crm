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
import { getGlobalParamsSubdivisions } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { DialogActions } from '@mui/material';

interface Props {
  open: boolean;
  id: number | null;
  handleClose: () => void;
}

export const SubdivisionsViewModal: FC<Props> = ({ open, id, handleClose }) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['subdivision', id],
    queryFn: () =>
      id !== null ? getGlobalParamsSubdivisions({ id: Number(id) }) : Promise.reject('Invalid ID')
  });

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="container-fixed max-w-screen-md p-0 [&>button]:hidden">
        <DialogHeader className="modal-rounded-t p-0 border-0 relative min-h-20 flex flex-col items-stretch justify-end bg-center bg-cover bg-no-repeat modal-bg">
          <DialogTitle className="absolute top-0 text-1.5xl ml-4 mt-3">
            Subdivision Details
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
          {data?.result && (
            <div className="card pb-2.5">
              <div className="card-body grid gap-5">
                <div className="border-b pb-4">
                  <h4 className="text-lg font-semibold mb-4">Subdivision Information</h4>
                  <div className="grid gap-3">
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 tex">Subdivision</label>
                      <div className="flex columns-1 w-full flex-wrap ">{data.result[0].name}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56">Language</label>
                      <div className="flex columns-1 w-full flex-wrap">
                        {data.result[0].language.name}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56">Currency</label>
                      <div className="flex columns-1 w-full flex-wrap">
                        {data.result[0].currency.name}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56">Timezone</label>
                      <div className="flex columns-1 w-full flex-wrap">
                        {data.result[0].timezone}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56">Is Active</label>
                      <div className="flex columns-1 w-full flex-wrap">
                        {data.result[0].is_active ? 'Enabled' : 'Disabled'}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56">Created at</label>
                      <div className="flex columns-1 w-full flex-wrap">
                        {data.result[0].created_at}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Client Block */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Company Information</h4>
                  <div className="grid gap-2.5">
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Company</label>
                      <div className="flex columns-1 w-full">
                        {data.result[0].company?.company_name || '-'}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Currency</label>
                      <div className="flex columns-1 w-full">
                        {data.result[0].company?.currency || '-'}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Language</label>
                      <div className="flex columns-1 w-full">
                        {data.result[0].company?.language || '-'}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Timezone</label>
                      <div className="flex columns-1 w-full">
                        {data.result[0].company?.timezone || '-'}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Legal address</label>
                      <div className="flex columns-1 w-full">
                        {data.result[0].company?.legal_address || '-'}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Warehouse address</label>
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
          {/*<button className="btn btn-md btn-primary m-3" disabled={id === null}>*/}
          {/*  Create Subdivision*/}
          {/*</button>*/}
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

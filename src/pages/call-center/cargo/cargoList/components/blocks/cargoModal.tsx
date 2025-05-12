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
import { getCargo } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';

interface Props {
  open: boolean;
  id: number | null;
  handleClose: () => void;
}

export const CargoModal: FC<Props> = ({ open, id, handleClose }) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['cargoID', id],
    queryFn: () => (id !== null ? getCargo(id) : Promise.reject('Invalid ID'))
  });

  const cargo = data?.result?.[0];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="container-fixed max-w-screen-md p-0 [&>button]:hidden">
        <DialogHeader className="modal-rounded-t p-0 border-0 relative min-h-20 flex flex-col items-stretch justify-end bg-center bg-cover bg-no-repeat modal-bg">
          <DialogTitle className="absolute top-0 text-1.5xl ml-4 mt-3">Cargo Details</DialogTitle>
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
          {cargo && (
            <div className="card pb-2.5">
              <div className="card-body grid gap-5">
                <div className="border-b pb-4">
                  <h4 className="text-lg font-semibold mb-3">Base</h4>
                  <div className="grid gap-2.5">
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Code</label>
                      <div className="flex columns-1 w-full">{cargo.code || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Status</label>
                      <div className="flex columns-1 w-full">{cargo.status || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Notes</label>
                      <div className="flex columns-1 w-full">{cargo.airline || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Notes</label>
                      <div className="flex columns-1 w-full">{cargo.departure_date || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Notes</label>
                      <div className="flex columns-1 w-full">{cargo.arrival_date || '-'}</div>
                    </div>
                  </div>
                </div>
                <div className="border-b pb-4">
                  <h4 className="text-lg font-semibold mb-3">Company</h4>
                  <div className="grid gap-2.5">
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Name</label>
                      <div className="flex columns-1 w-full">
                        {cargo.company.company_name || '-'}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">TimeZone</label>
                      <div className="flex columns-1 w-full">{cargo.company.timezone || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Currency</label>
                      <div className="flex columns-1 w-full">{cargo.company.currency || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Language</label>
                      <div className="flex columns-1 w-full">{cargo.company.language || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Legal address</label>
                      <div className="flex columns-1 w-full">
                        {cargo.company.legal_address || '-'}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Warehouse address</label>
                      <div className="flex columns-1 w-full">
                        {cargo.company.warehouse_address || '-'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

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
import { getApplications } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';

interface Props {
  open: boolean;
  id: number | null;
  handleClose: () => void;
}

export const ApplicationsModal: FC<Props> = ({ open, id, handleClose }) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['application', id],
    queryFn: () => (id !== null ? getApplications(id) : Promise.reject('Invalid ID'))
  });
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="container-fixed max-w-screen-md p-0 [&>button]:hidden">
        <DialogHeader className="modal-rounded-t p-0 border-0 relative min-h-20 flex flex-col items-stretch justify-end bg-center bg-cover bg-no-repeat modal-bg">
          <DialogTitle className="absolute top-0 text-1.5xl ml-4 mt-3">Info</DialogTitle>
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
                <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                  <label className="form-label max-w-56">Full name</label>
                  <div className="flex columns-1 w-full flex-wrap">{data.result[0].full_name}</div>
                </div>

                <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                  <label className="form-label max-w-56">Phone number</label>
                  <div className="flex columns-1 w-full flex-wrap">{data.result[0].phone}</div>
                </div>

                <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                  <label className="form-label max-w-56">Source</label>
                  <div className="flex columns-1 w-full flex-wrap">
                    {data.result[0].source.name}
                  </div>
                </div>

                <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                  <label className="form-label max-w-56">Email</label>
                  <div className="flex columns-1 w-full flex-wrap">{data.result[0].email}</div>
                </div>

                <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                  <label className="form-label max-w-56">Message</label>
                  <div className="flex columns-1 w-full flex-wrap">{data.result[0].message}</div>
                </div>

                <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                  <label className="form-label max-w-56">Client</label>
                  <div className="flex columns-1 w-full flex-wrap">{data.result[0].client_id}</div>
                </div>

                <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                  <label className="form-label max-w-56">Status</label>
                  <div className="flex columns-1 w-full flex-wrap">{data.result[0].status}</div>
                </div>

                <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                  <label className="form-label max-w-56">Created at</label>
                  <div className="flex columns-1 w-full flex-wrap">
                    {new Date(data.result[0].created_at).toLocaleDateString('ru-RU')}
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

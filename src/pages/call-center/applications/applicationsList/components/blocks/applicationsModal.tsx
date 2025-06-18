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
import { DialogActions } from '@mui/material';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { useNavigate } from 'react-router';
import { ApplicationsStatus } from '@/api/enums';

interface Props {
  open: boolean;
  id: number | null;
  handleClose: () => void;
}

export const ApplicationsModal: FC<Props> = ({ open, id, handleClose }) => {
  const { currentUser } = useAuthContext();
  const navigate = useNavigate();
  const { has } = useUserPermissions();
  const canManage = has('manage applications') || currentUser?.roles[0].name === 'superadmin';

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['application', id],
    queryFn: () =>
      id !== null ? getApplications({ id: Number(id) }) : Promise.reject('Invalid ID')
  });

  const handleCreateOrder = (applicationId: number | null) => {
    if (applicationId !== null) {
      navigate(`/call-center/orders/starter?application_id=${applicationId}`);
    }
  };

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
                <div className="border-b pb-4">
                  <h4 className="text-lg font-semibold mb-4">Application Information</h4>
                  <div className="grid gap-3">
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56">Application</label>
                      <div className="flex columns-1 w-full flex-wrap">
                        {data.result[0].full_name}
                      </div>
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
                      <div className="flex columns-1 w-full flex-wrap">{data.result[0]?.email}</div>
                    </div>

                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56">Client</label>
                      <div className="flex columns-1 w-full flex-wrap">
                        {data.result[0].client_id}
                      </div>
                    </div>

                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56">Status</label>
                      <div className="flex columns-1 w-full flex-wrap">{data.result[0].status}</div>
                    </div>

                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56">Message</label>
                      <div className="flex columns-1 w-full flex-wrap">
                        {data.result[0].message}
                      </div>
                    </div>

                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56">Created at</label>
                      <div className="flex columns-1 w-full flex-wrap">
                        {new Date(data.result[0].created_at).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Client Block */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Client Information</h4>
                  <div className="grid gap-2.5">
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Type</label>
                      <div className="flex columns-1 w-full">
                        {data.result[0].client?.type || '-'}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {data.result[0].client?.type === 'legal' ? 'Company name' : 'Full name'}
                      </label>
                      <div className="flex columns-1 w-full">
                        {data.result[0].client?.fullname || '-'}
                      </div>
                    </div>
                    {data.result[0].client?.type === 'legal' && (
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">BIN</label>
                        <div className="flex columns-1 w-full">
                          {data.result[0].client?.bin || '-'}
                        </div>
                      </div>
                    )}
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">Phone</label>
                      <div className="flex columns-1 w-full">
                        {data.result[0].client?.phone || '-'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogBody>
        {canManage && (
          <DialogActions>
            <a className="btn btn-md btn-light" href={`/call-center/applications/starter/${id}`}>
              Update Application
            </a>
            {data?.result[0].status === ApplicationsStatus.NEW && (
              <button
                className="btn btn-md btn-primary m-3"
                onClick={() => handleCreateOrder(id)}
                disabled={id === null}
              >
                Create Order
              </button>
            )}
          </DialogActions>
        )}
      </DialogContent>
    </Dialog>
  );
};

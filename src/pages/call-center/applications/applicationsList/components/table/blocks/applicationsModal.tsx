import { useIntl } from 'react-intl';
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
  const { formatMessage } = useIntl();
  const { currentUser } = useAuthContext();
  const navigate = useNavigate();
  const { has } = useUserPermissions();

  const canManage = has('manage applications') || currentUser?.roles[0].name === 'superadmin';

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['application', id],
    queryFn: () =>
      id !== null ? getApplications({ id: Number(id) }) : Promise.reject('Invalid ID')
  });

  const applicationData = data?.result[0];

  const handleCreateOrder = (applicationId: number | null) => {
    if (applicationId !== null) {
      navigate(`/call-center/orders/starter?application_id=${applicationId}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="container-fixed max-w-screen-md p-0 [&>button]:hidden">
        <DialogHeader className="modal-rounded-t p-0 border-0 relative min-h-20 flex flex-col items-stretch justify-end bg-center bg-cover bg-no-repeat modal-bg">
          <DialogTitle className="absolute top-0 text-1.5xl ml-4 mt-3">
            {formatMessage({ id: 'SYSTEM.APPLICATION_DETAILS' })}
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
          {applicationData && (
            <div className="card pb-2.5">
              <div className="card-body grid gap-5">
                <div>
                  <h4 className="text-lg font-semibold mb-4">
                    {formatMessage({ id: 'SYSTEM.APPLICATION_INFO' })}
                  </h4>
                  <div className="grid gap-3">
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56">
                        {formatMessage({ id: 'SYSTEM.APPLICATION' })}
                      </label>
                      <div className="flex columns-1 w-full flex-wrap">
                        {applicationData?.full_name || '-'}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56">
                        {formatMessage({ id: 'SYSTEM.PHONE_NUMBER' })}
                      </label>
                      <div className="flex columns-1 w-full flex-wrap">
                        {applicationData?.phone || '-'}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56">
                        {formatMessage({ id: 'SYSTEM.SOURCE' })}
                      </label>
                      <div className="flex columns-1 w-full flex-wrap">
                        {applicationData?.source.name || '-'}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56">
                        {formatMessage({ id: 'SYSTEM.EMAIL' })}
                      </label>
                      <div className="flex columns-1 w-full flex-wrap">
                        {applicationData?.email || '-'}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56">
                        {formatMessage({ id: 'SYSTEM.STATUS' })}
                      </label>
                      <div className="flex columns-1 w-full flex-wrap">
                        {applicationData.status || '-'}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56">
                        {formatMessage({ id: 'SYSTEM.MESSAGE' })}
                      </label>
                      <div className="flex columns-1 w-full flex-wrap">
                        {applicationData.message || '-'}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56">
                        {formatMessage({ id: 'SYSTEM.CREATED_AT' })}
                      </label>
                      <div className="flex columns-1 w-full flex-wrap">
                        {new Date(applicationData.created_at).toLocaleDateString('ru-RU') || '-'}
                      </div>
                    </div>
                  </div>
                </div>

                {applicationData?.client && (
                  <div className="border-t pt-4">
                    <h4 className="text-lg font-semibold mb-4">
                      {formatMessage({ id: 'SYSTEM.CLIENT_INFO' })}
                    </h4>
                    <div className="grid gap-2.5">
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {formatMessage({ id: 'SYSTEM.TYPE' })}
                        </label>
                        <div className="flex columns-1 w-full">
                          {applicationData?.client?.type || '-'}
                        </div>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {applicationData?.client?.type === 'legal'
                            ? formatMessage({ id: 'SYSTEM.COMPANY_NAME' })
                            : formatMessage({ id: 'SYSTEM.FULL_NAME' })}
                        </label>
                        <div className="flex columns-1 w-full">
                          <a
                            className="link"
                            href={`/clients/id=${applicationData?.client?.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {applicationData?.client?.fullname || '-'}
                          </a>
                        </div>
                      </div>
                      {applicationData?.client?.type === 'legal' && (
                        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                          <label className="form-label max-w-56 text-gray-600">
                            {formatMessage({ id: 'SYSTEM.BIN' })}
                          </label>
                          <div className="flex columns-1 w-full">
                            {applicationData?.client?.bin || '-'}
                          </div>
                        </div>
                      )}
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {formatMessage({ id: 'SYSTEM.PHONE' })}
                        </label>
                        <div className="flex columns-1 w-full">
                          {applicationData?.client?.phone || '-'}
                        </div>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {formatMessage({ id: 'SYSTEM.EMAIL' })}
                        </label>
                        <div className="flex columns-1 w-full">
                          {applicationData?.client?.email || '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {(applicationData?.country_of_arrival || applicationData?.country_of_departure) && (
                  <div className="border-t pt-4">
                    <h4 className="text-lg font-semibold mb-4">
                      {formatMessage({ id: 'SYSTEM.ROUTE' })}
                    </h4>
                    <div className="grid gap-2.5">
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {formatMessage({ id: 'SYSTEM.COUNTRY_OF_DEPARTURE' })}
                        </label>
                        <div className="flex columns-1 w-full">
                          {applicationData?.country_of_departure || '-'}
                        </div>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {formatMessage({ id: 'SYSTEM.COUNTRY_OF_ARRIVAL' })}
                        </label>
                        <div className="flex columns-1 w-full">
                          {applicationData?.country_of_arrival || '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {(applicationData?.weight ||
                  applicationData?.width ||
                  applicationData?.length ||
                  applicationData?.height) && (
                  <div className="border-t pt-4">
                    <h4 className="text-lg font-semibold mb-4">
                      {formatMessage({ id: 'SYSTEM.SIZES' })}
                    </h4>
                    <div className="grid gap-2.5">
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {formatMessage({ id: 'SYSTEM.WEIGHT' }) + ' (kg)'}
                        </label>
                        <div className="flex columns-1 w-full">
                          {applicationData?.weight || '-'}
                        </div>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {formatMessage({ id: 'SYSTEM.WIDTH' }) + ' (cm)'}
                        </label>
                        <div className="flex columns-1 w-full">{applicationData?.width || '-'}</div>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {formatMessage({ id: 'SYSTEM.LENGTH' }) + ' (cm)'}
                        </label>
                        <div className="flex columns-1 w-full">
                          {applicationData?.length || '-'}
                        </div>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {formatMessage({ id: 'SYSTEM.HEIGHT' }) + ' (cm)'}
                        </label>
                        <div className="flex columns-1 w-full">
                          {applicationData?.height || '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {(applicationData?.box_type_id || applicationData?.box_height) && (
                  <div className="border-t pt-4">
                    <h4 className="text-lg font-semibold mb-4">
                      {formatMessage({ id: 'SYSTEM.BOX_TYPE' })}
                    </h4>
                    <div className="grid gap-2.5">
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {formatMessage({ id: 'SYSTEM.WIDTH' }) + ' (cm)'}
                        </label>
                        <div className="flex columns-1 w-full">{applicationData?.width || '-'}</div>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {formatMessage({ id: 'SYSTEM.LENGTH' }) + ' (cm)'}
                        </label>
                        <div className="flex columns-1 w-full">
                          {applicationData?.length || '-'}
                        </div>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {formatMessage({ id: 'SYSTEM.HEIGHT' }) + ' (cm)'}
                        </label>
                        <div className="flex columns-1 w-full">
                          {applicationData?.height || '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogBody>
        {canManage && (
          <DialogActions>
            <a className="btn btn-md btn-light" href={`/call-center/applications/starter/${id}`}>
              {formatMessage({ id: 'SYSTEM.UPDATE_APPLICATION' })}
            </a>
            {data?.result[0].status === ApplicationsStatus.NEW && (
              <button
                className="btn btn-md btn-primary m-3"
                onClick={() => handleCreateOrder(id)}
                disabled={id === null}
              >
                {formatMessage({ id: 'SYSTEM.CREATE_ORDER' })}
              </button>
            )}
          </DialogActions>
        )}
      </DialogContent>
    </Dialog>
  );
};

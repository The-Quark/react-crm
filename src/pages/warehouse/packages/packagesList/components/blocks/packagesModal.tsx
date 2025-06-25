import React, { FC } from 'react';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog.tsx';
import { KeenIcon } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { getPackages } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { DialogActions } from '@mui/material';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { useNavigate } from 'react-router';
import { PackageStatus } from '@/api/enums';
import { useIntl } from 'react-intl';

interface Props {
  open: boolean;
  id: number | null;
  handleClose: () => void;
}

export const PackagesModal: FC<Props> = ({ open, id, handleClose }) => {
  const { formatMessage } = useIntl();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const navigate = useNavigate();
  const canManage = has('manage orders') || currentUser?.roles[0].name === 'superadmin';
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['packageID', id],
    queryFn: () => (id !== null ? getPackages({ id: Number(id) }) : Promise.reject('Invalid ID'))
  });

  const packageData = data?.result?.[0];

  const url = packageData?.hawb_pdf.startsWith('http')
    ? packageData.hawb_pdf
    : `https://${packageData?.hawb_pdf}`;

  const handleCreateCargo = (applicationId: number | null) => {
    if (applicationId !== null) {
      navigate(`/warehouse/cargo/starter?package_id=${applicationId}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="container-fixed max-w-screen-md p-0 [&>button]:hidden">
        <DialogHeader className="modal-rounded-t p-0 border-0 relative min-h-20 flex flex-col items-stretch justify-end bg-center bg-cover bg-no-repeat modal-bg">
          <DialogTitle className="absolute top-0 text-1.5xl ml-4 mt-3">
            {formatMessage({ id: 'SYSTEM.PACKAGE_DETAILS' })}
          </DialogTitle>
          <button
            className="btn btn-sm btn-icon btn-light btn-outline absolute top-0 end-0 me-3 mt-3 lg:me-3 shadow-default"
            data-modal-dismiss="true"
            onClick={handleClose}
          >
            <KeenIcon icon="cross" />
          </button>
          <DialogDescription />
        </DialogHeader>
        <DialogBody className="py-0 mb-5 ps-5 pe-3 me-3">
          {isLoading && <SharedLoading />}
          {isError && <SharedError error={error} />}
          {packageData && (
            <div className="card pb-2.5">
              <div className="card-body grid gap-5">
                <div className="border-b pb-4">
                  <h4 className="text-lg font-semibold mb-3">
                    {formatMessage({ id: 'SYSTEM.BASE' })}
                  </h4>
                  <div className="grid gap-2.5">
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.HAWB' })}
                      </label>
                      <div className="flex columns-1 w-full">{packageData.hawb || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.STATUS' })}
                      </label>
                      <div className="flex columns-1 w-full">{packageData.status || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.DOCUMENT' })}
                      </label>
                      <a className="link" href={url} target="_blank" rel="noopener noreferrer">
                        {formatMessage({ id: 'SYSTEM.HAWB_DOC' })}
                      </a>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.WEIGHT' })}
                      </label>
                      <div className="flex columns-1 w-full">{packageData.weight || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.WIDTH' })}
                      </label>
                      <div className="flex columns-1 w-full">{packageData.width || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.HEIGHT' })}
                      </label>
                      <div className="flex columns-1 w-full">{packageData.height || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.LENGTH' })}
                      </label>
                      <div className="flex columns-1 w-full">{packageData.length || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.VOLUME' })}
                      </label>
                      <div className="flex columns-1 w-full">{packageData.volume || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.PLACE_COUNT' })}
                      </label>
                      <div className="flex columns-1 w-full">{packageData.places_count || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.PRICE' })}
                      </label>
                      <div className="flex columns-1 w-full">{packageData.price || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.DIMENSIONS' })}
                      </label>
                      <div className="flex columns-1 w-full">{packageData.dimensions || '-'}</div>
                    </div>
                  </div>
                </div>
                {packageData?.client && packageData.client.type === 'legal' ? (
                  <div className="">
                    <h4 className="text-lg font-semibold mb-3">
                      {formatMessage({ id: 'SYSTEM.COMPANY_INFO' })}
                    </h4>
                    <div className="grid gap-2.5">
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {formatMessage({ id: 'SYSTEM.NAME' })}
                        </label>
                        <div className="flex columns-1 w-full">
                          {packageData.client.company_name || '-'}
                        </div>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {formatMessage({ id: 'SYSTEM.PHONE' })}
                        </label>
                        <div className="flex columns-1 w-full">
                          {packageData.client.phone || '-'}
                        </div>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {formatMessage({ id: 'SYSTEM.EMAIL' })}
                        </label>
                        <div className="flex columns-1 w-full">
                          {packageData.client.email || '-'}
                        </div>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {formatMessage({ id: 'SYSTEM.REPRESENTATIVE' })}
                        </label>
                        <div className="flex columns-1 w-full">
                          {(packageData.client.representative_last_name || '-') +
                            ' ' +
                            (packageData.client.representative_first_name || '-') +
                            ' ' +
                            (packageData.client.representative_patronymic || '-')}
                        </div>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {formatMessage({ id: 'SYSTEM.REPRESENTATIVE_PHONE' })}
                        </label>
                        <div className="flex columns-1 w-full">
                          {packageData.client.representative_phone || '-'}
                        </div>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {formatMessage({ id: 'SYSTEM.REPRESENTATIVE_EMAIL' })}
                        </label>
                        <div className="flex columns-1 w-full">
                          {packageData.client.representative_email || '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-b pb-4">
                    <h4 className="text-lg font-semibold mb-3">
                      {formatMessage({ id: 'SYSTEM.CLIENT' })}
                    </h4>
                    <div className="grid gap-2.5">
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {formatMessage({ id: 'SYSTEM.FULL_NAME' })}
                        </label>
                        <div className="flex columns-1 w-full">
                          {(packageData.client?.last_name || '-') +
                            ' ' +
                            (packageData.client?.first_name || '-') +
                            ' ' +
                            (packageData.client?.patronymic || '-')}
                        </div>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {formatMessage({ id: 'SYSTEM.PHONE' })}
                        </label>
                        <div className="flex columns-1 w-full">
                          {packageData.client?.phone || '-'}
                        </div>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {formatMessage({ id: 'SYSTEM.EMAIL' })}
                        </label>
                        <div className="flex columns-1 w-full">
                          {packageData.client?.email || '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {packageData?.assigned_user && (
                  <div className="">
                    <h4 className="text-lg font-semibold mb-3">
                      {formatMessage({ id: 'SYSTEM.ASSIGNED_USER_INFO' })}
                    </h4>
                    <div className="grid gap-2.5">
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {formatMessage({ id: 'SYSTEM.FULL_NAME' })}
                        </label>
                        <div className="flex columns-1 w-full">
                          {(packageData.assigned_user?.last_name || '-') +
                            ' ' +
                            (packageData.assigned_user?.first_name || '-') +
                            ' ' +
                            (packageData.assigned_user?.patronymic || '-')}
                        </div>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {formatMessage({ id: 'SYSTEM.PHONE' })}
                        </label>
                        <div className="flex columns-1 w-full">
                          {packageData.assigned_user?.phone || '-'}
                        </div>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56 text-gray-600">
                          {formatMessage({ id: 'SYSTEM.EMAIL' })}
                        </label>
                        <div className="flex columns-1 w-full">
                          {packageData.assigned_user?.email || '-'}
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
            <div className="flex gap-4 mb-2 mr-3">
              <a className="btn btn-md btn-light" href={`/warehouse/packages/starter/${id}`}>
                {formatMessage({ id: 'SYSTEM.UPDATE_PACKAGE' })}
              </a>
              {data?.result[0].status === PackageStatus.READY_FOR_SHIPMENT && (
                <button
                  className="btn btn-md btn-primary"
                  onClick={() => handleCreateCargo(id)}
                  disabled={id === null}
                >
                  {formatMessage({ id: 'SYSTEM.CREATE_CARGO' })}
                </button>
              )}
            </div>
          </DialogActions>
        )}
      </DialogContent>
    </Dialog>
  );
};

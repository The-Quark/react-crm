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
import { getCargo } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { DialogActions, Divider } from '@mui/material';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { useIntl } from 'react-intl';

interface Props {
  open: boolean;
  id: number | null;
  handleClose: () => void;
}

export const CargoModal: FC<Props> = ({ open, id, handleClose }) => {
  const { formatMessage } = useIntl();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManage = has('manage orders') || currentUser?.roles[0].name === 'superadmin';
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['cargoID', id],
    queryFn: () => (id !== null ? getCargo({ id: Number(id) }) : Promise.reject('Invalid ID'))
  });

  const cargo = data?.result?.[0];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="container-fixed max-w-screen-md p-0 [&>button]:hidden">
        <DialogHeader className="modal-rounded-t p-0 border-0 relative min-h-20 flex flex-col items-stretch justify-end bg-center bg-cover bg-no-repeat modal-bg">
          <DialogTitle className="absolute top-0 text-1.5xl ml-4 mt-3">
            {formatMessage({ id: 'SYSTEM.CARGO_DETAILS' })}
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
          {cargo && (
            <div className="card pb-2.5">
              <div className="card-body grid gap-5">
                <div className="border-b pb-4">
                  <h4 className="text-lg font-semibold mb-3">
                    {formatMessage({ id: 'SYSTEM.CARGO' })}
                  </h4>
                  <div className="grid gap-2.5">
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.MAWB_CODE' })}
                      </label>
                      <div className="flex columns-1 w-full">{cargo.code || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.DELIVERY_CATEGORY' })}
                      </label>
                      <div className="flex columns-1 w-full">
                        {cargo.delivery_category?.map((cat) => cat) || '-'}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.DOCUMENT_COUNT' })}
                      </label>
                      <div className="flex columns-1 w-full">{cargo.document_count || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.AIRLINE' })}
                      </label>
                      <div className="flex columns-1 w-full">{cargo.airline || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.DEPARTURE_AIRPORT' })}
                      </label>
                      <div className="flex columns-1 w-full">{cargo.from_airport || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.ARRIVAL_AIRPORT' })}
                      </label>
                      <div className="flex columns-1 w-full">{cargo.to_airport || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.DEPARTURE_DATE' })}
                      </label>
                      <div className="flex columns-1 w-full">{cargo.departure_date || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.ARRIVAL_DATE' })}
                      </label>
                      <div className="flex columns-1 w-full">{cargo.arrival_date || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.STATUS' })}
                      </label>
                      <div className="flex columns-1 w-full">{cargo.status || '-'}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">
                    {formatMessage({ id: 'SYSTEM.PACKAGES' })}
                  </h4>
                  <div className="grid gap-2.5">
                    {cargo.packages.map((pkg, ids) => (
                      <>
                        {ids > 0 && <Divider className="pt-2" />}
                        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                          <label className="form-label max-w-56 text-gray-600">
                            {formatMessage({ id: 'SYSTEM.HAWB' })}
                          </label>
                          <div className="flex columns-1 w-full">
                            <a
                              className="link"
                              href={`/warehouse/packages/list/id=${pkg.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {pkg.hawb || '-'}
                            </a>
                          </div>
                        </div>
                        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                          <label className="form-label max-w-56 text-gray-600">
                            {formatMessage({ id: 'SYSTEM.STATUS' })}
                          </label>
                          <div className="flex columns-1 w-full">{pkg.status || '-'}</div>
                        </div>
                      </>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">
                    {formatMessage({ id: 'SYSTEM.COMPANY' })}
                  </h4>
                  <div className="grid gap-2.5">
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.COMPANY_NAME' })}
                      </label>
                      <div className="flex columns-1 w-full">
                        {cargo.company.company_name || '-'}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.TIMEZONE' })}
                      </label>
                      <div className="flex columns-1 w-full">{cargo.company.timezone || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.CURRENCY' })}
                      </label>
                      <div className="flex columns-1 w-full">{cargo.company.currency || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.LANGUAGE' })}
                      </label>
                      <div className="flex columns-1 w-full">{cargo.company.language || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.TIMEZONE' })}
                      </label>
                      <div className="flex columns-1 w-full">{cargo.company.timezone || '-'}</div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.DIMENSIONS_PER_PLACE' })}
                      </label>
                      <div className="flex columns-1 w-full">
                        {cargo.company.dimensions_per_place || '-'}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.COST_PER_PLACE' })}
                      </label>
                      <div className="flex columns-1 w-full">
                        {cargo.company.cost_per_airplace || '-'}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.LEGAL_ADDRESS' })}
                      </label>
                      <div className="flex columns-1 w-full">
                        {cargo.company.legal_address || '-'}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56 text-gray-600">
                        {formatMessage({ id: 'SYSTEM.WAREHOUSE_ADDRESS' })}
                      </label>
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
        {canManage && (
          <DialogActions>
            <a className="btn btn-md btn-light mr-3 mb-3" href={`/warehouse/cargo/starter/${id}`}>
              {formatMessage({ id: 'SYSTEM.UPDATE_CARGO' })}
            </a>
          </DialogActions>
        )}
      </DialogContent>
    </Dialog>
  );
};

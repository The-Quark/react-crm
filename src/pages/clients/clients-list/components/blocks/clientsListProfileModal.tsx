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
import { getClients } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { DialogActions } from '@mui/material';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { useNavigate } from 'react-router';
import { useIntl } from 'react-intl';

interface Props {
  open: boolean;
  id: number | null;
  handleClose: () => void;
}

export const ClientsListProfileModal: FC<Props> = ({ open, id, handleClose }) => {
  const { currentUser } = useAuthContext();
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const { has } = useUserPermissions();

  const canManage = has('manage clients') || currentUser?.roles[0].name === 'superadmin';

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['clients-id', id],
    queryFn: () => (id !== null ? getClients({ id: Number(id) }) : Promise.reject('Invalid ID'))
  });

  const handleCreateApplication = (clientID: number | null) => {
    if (clientID !== null) {
      navigate(`/call-center/applications/starter?client_id=${clientID}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="container-fixed max-w-screen-lg p-0 [&>button]:hidden">
        <DialogHeader className="modal-rounded-t p-0 border-0 relative min-h-20 flex flex-col items-stretch justify-end bg-center bg-cover bg-no-repeat modal-bg">
          <DialogTitle className="absolute top-0 text-1.5xl ml-4 mt-3">
            {formatMessage({ id: 'SYSTEM.CLIENT' })}
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
            <div className="grid grid-cols- gap-2 lg:grid-cols-2 md:grid-cols-2">
              <div className="card pb-2.5">
                <div className="card-body grid gap-5">
                  {data.result[0].type === 'individual' ? (
                    <>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap  gap-2.5">
                        <label className="form-label max-w-56">
                          {formatMessage({ id: 'SYSTEM.CODE' })}
                        </label>
                        <div className="flex columns-1 w-full flex-wrap">
                          {data.result[0].initials_code}
                        </div>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap  gap-2.5">
                        <label className="form-label max-w-56">
                          {formatMessage({ id: 'SYSTEM.FIRST_NAME' })}
                        </label>
                        <div className="flex columns-1 w-full flex-wrap">
                          {data.result[0].first_name}
                        </div>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56">
                          {formatMessage({ id: 'SYSTEM.LAST_NAME' })}
                        </label>
                        <div className="flex columns-1 w-full flex-wrap">
                          {data.result[0].last_name}
                        </div>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56">
                          {formatMessage({ id: 'SYSTEM.PATRONYMIC' })}
                        </label>
                        <div className="flex columns-1 w-full flex-wrap">
                          {data.result[0]?.patronymic}
                        </div>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56">
                          {formatMessage({ id: 'SYSTEM.BIRTH_DATE' })}
                        </label>
                        <div className="flex columns-1 w-full flex-wrap">
                          {data.result[0]?.birth_date}
                        </div>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56">
                          {formatMessage({ id: 'SYSTEM.GENDER' })}
                        </label>
                        <div className="flex columns-1 w-full flex-wrap">
                          {data.result[0]?.gender}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56">
                          {formatMessage({ id: 'SYSTEM.COMPANY_NAME' })}
                        </label>
                        <div className="flex columns-1 w-full flex-wrap">
                          {data.result[0]?.company_name}
                        </div>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56">
                          {formatMessage({ id: 'SYSTEM.BIN' })}
                        </label>
                        <div className="flex columns-1 w-full flex-wrap">{data.result[0]?.bin}</div>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56">
                          {formatMessage({ id: 'SYSTEM.BUSINESS_TYPE' })}
                        </label>
                        <div className="flex columns-1 w-full flex-wrap">
                          {data.result[0]?.business_type}
                        </div>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56">
                          {formatMessage({ id: 'SYSTEM.LEGAL_ADDRESS' })}
                        </label>
                        <div className="flex columns-1 w-full flex-wrap">
                          {data.result[0]?.legal_address}
                        </div>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56">
                          {formatMessage({ id: 'SYSTEM.REPRESENTATIVE_FIRST_NAME' })}
                        </label>
                        <div className="flex columns-1 w-full flex-wrap">
                          {data.result[0]?.representative_first_name}
                        </div>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56">
                          {formatMessage({ id: 'SYSTEM.REPRESENTATIVE_LAST_NAME' })}
                        </label>
                        <div className="flex columns-1 w-full flex-wrap">
                          {data.result[0]?.representative_last_name}
                        </div>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56">
                          {formatMessage({ id: 'SYSTEM.REPRESENTATIVE_PATRONYMIC' })}
                        </label>
                        <div className="flex columns-1 w-full flex-wrap">
                          {data.result[0]?.representative_patronymic}
                        </div>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56">
                          {formatMessage({ id: 'SYSTEM.REPRESENTATIVE_PHONE' })}
                        </label>
                        <div className="flex columns-1 w-full flex-wrap">
                          {data.result[0]?.representative_phone}
                        </div>
                      </div>
                      <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <label className="form-label max-w-56">
                          {formatMessage({ id: 'SYSTEM.REPRESENTATIVE_EMAIL' })}
                        </label>
                        <div className="flex columns-1 w-full flex-wrap">
                          {data.result[0]?.representative_email}
                        </div>
                      </div>
                    </>
                  )}
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56">
                      {formatMessage({ id: 'SYSTEM.COUNTRY' })}
                    </label>
                    <div className="flex columns-1 w-full flex-wrap">
                      {data.result[0].country_name}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56">
                      {formatMessage({ id: 'SYSTEM.CITY' })}
                    </label>
                    <div className="flex columns-1 w-full flex-wrap">
                      {data.result[0].city_name}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56">
                      {formatMessage({ id: 'SYSTEM.PHONE_NUMBER' })}
                    </label>
                    <div className="flex columns-1 w-full flex-wrap">{data.result[0].phone}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56">
                      {formatMessage({ id: 'SYSTEM.PHONE_NUMBER_HISTORY' })}
                    </label>
                    <div className="flex columns-1 w-full flex-wrap">
                      {data.result[0].phone_history
                        ? data.result[0].phone_history.map((phone) => phone.toString()).join(', ')
                        : ''}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56">
                      {formatMessage({ id: 'SYSTEM.EMAIL' })}
                    </label>
                    <div className="flex columns-1 w-full flex-wrap">{data.result[0]?.email}</div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56">
                      {formatMessage({ id: 'SYSTEM.RATING' })}
                    </label>
                    <div className="flex columns-1 w-full flex-wrap">
                      {data.result[0]?.client_rating}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56">
                      {formatMessage({ id: 'SYSTEM.CLIENT_STATUS' })}
                    </label>
                    <div className="flex columns-1 w-full flex-wrap">
                      {data.result[0]?.client_status}
                    </div>
                  </div>
                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56">
                      {formatMessage({ id: 'SYSTEM.NOTES' })}
                    </label>
                    <div className="flex columns-1 w-full flex-wrap">{data.result[0]?.notes}</div>
                  </div>

                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56">
                      {formatMessage({ id: 'SYSTEM.SOURCE' })}
                    </label>
                    <div className="flex columns-1 w-full flex-wrap">
                      {data.result[0].source.name}
                    </div>
                  </div>

                  <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                    <label className="form-label max-w-56">
                      {formatMessage({ id: 'SYSTEM.CREATED_AT' })}
                    </label>
                    <div className="flex columns-1 w-full flex-wrap">
                      {new Date(data.result[0].created_at).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="card pb-2.5">
                  <div className="card-body grid gap-5">
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56">
                        {formatMessage({ id: 'SYSTEM.APPLICATIONS' })}
                      </label>
                      <div className="flex columns-1 w-full flex-wrap">
                        {data.result[0].application_count}
                      </div>
                    </div>
                    <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                      <label className="form-label max-w-56">
                        {formatMessage({ id: 'SYSTEM.PACKAGES' })}
                      </label>
                      <div className="flex columns-1 w-full flex-wrap">
                        {data.result[0]?.applications_packages_count}
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
            <a className="btn btn-md btn-light" href={`/clients/starter-clients/${id}`}>
              {formatMessage({ id: 'SYSTEM.UPDATE_CLIENT' })}
            </a>
            <button
              className="btn btn-md btn-primary m-3"
              disabled={id === null}
              onClick={() => handleCreateApplication(id)}
            >
              {formatMessage({ id: 'SYSTEM.CREATE_APPLICATION' })}
            </button>
          </DialogActions>
        )}
      </DialogContent>
    </Dialog>
  );
};

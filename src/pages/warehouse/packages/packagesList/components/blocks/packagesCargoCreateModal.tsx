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
import { getCargoNotification } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { useNavigate } from 'react-router';
import { useIntl } from 'react-intl';

interface Props {
  open: boolean;
  handleClose: () => void;
}

export const PackagesCargoCreateModal: FC<Props> = ({ open, handleClose }) => {
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();

  const canManage = has('manage orders') || currentUser?.roles[0].name === 'superadmin';

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['createCargoNotifications'],
    queryFn: () => getCargoNotification()
  });

  const handleCreateCargo = (packageIds: number[]) => {
    navigate(`/warehouse/cargo/starter?package_id=${packageIds.join(',')}`);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="container-fixed max-w-screen-md p-0 [&>button]:hidden">
        <DialogHeader className="modal-rounded-t p-0 border-0 relative min-h-20 flex flex-col items-stretch justify-end bg-center bg-cover bg-no-repeat modal-bg">
          <DialogTitle className="absolute top-0 text-1.5xl ml-4 mt-3">
            {formatMessage({ id: 'SYSTEM.CARGO_NOTIFICATIONS' })}
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
          {data?.notifications && (
            <div className="grid gap-4">
              {data.notifications.map((notification, index) => (
                <div key={index} className="card p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold">
                        {formatMessage({ id: 'SYSTEM.SENDER_CITY' })}
                      </h4>
                      <p>{notification.sender_city_name}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        {formatMessage({ id: 'SYSTEM.RECEIVER_CITY' })}
                      </h4>
                      <p>{notification.receiver_city_name}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        {formatMessage({ id: 'SYSTEM.PACKAGE_COUNT' })}
                      </h4>
                      <p>{notification.count}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        {formatMessage({ id: 'SYSTEM.PACKAGE_IDS' })}
                      </h4>
                      <p>{notification.package_ids.join(', ')}</p>
                    </div>
                  </div>
                  {canManage && (
                    <button
                      className="btn btn-primary self-end"
                      onClick={() => handleCreateCargo(notification.package_ids)}
                    >
                      {formatMessage({ id: 'SYSTEM.CREATE_CARGO' })}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

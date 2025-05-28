import { cn } from '@/lib/utils';
import { UserStatus, UserDriverStatus } from '@/api/enums';

type StatusType = UserStatus | UserDriverStatus | string;

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export const SharedStatusBadge = ({ status, className }: StatusBadgeProps) => {
  const statusConfig = {
    [UserStatus.ACTIVE]: {
      label: 'Active',
      color: 'badge-success'
    },
    [UserStatus.VACATION]: {
      label: 'Vacation',
      color: 'badge-info'
    },
    [UserStatus.FIRED]: {
      label: 'Fired',
      color: 'badge-danger'
    },
    [UserStatus.STAGING]: {
      label: 'Staging',
      color: 'badge-warning'
    },
    [UserStatus.DECREE]: {
      label: 'Decree',
      color: 'badge-primary'
    },
    [UserStatus.UNAVAILABLE]: {
      label: 'Unavailable',
      color: 'badge-secondary'
    },
    [UserDriverStatus.AVAILABLE]: {
      label: 'Available',
      color: 'badge-success'
    },
    unknown: {
      label: String(status),
      color: 'badge-default'
    }
  };

  const normalizedStatus = Object.values(UserStatus).includes(status as UserStatus)
    ? (status as UserStatus)
    : Object.values(UserDriverStatus).includes(status as UserDriverStatus)
      ? (status as UserDriverStatus)
      : 'unknown';

  const config = statusConfig[normalizedStatus] || statusConfig.unknown;

  return (
    <div className={cn('badge badge-sm badge-outline', config.color, className)}>
      {config.label}
    </div>
  );
};

import { cn } from '@/lib/utils';
import { UserStatus, UserDriverStatus } from '@/api/enums';

type StatusType = UserStatus | UserDriverStatus | string;

interface StatusBadgeProps {
  status: StatusType | boolean;
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
    true: {
      label: 'Active',
      color: 'badge-success'
    },
    false: {
      label: 'Inactive',
      color: 'badge-danger'
    },
    unknown: {
      label: String(status),
      color: 'badge-default'
    }
  };

  let normalizedStatus: StatusType | 'true' | 'false';

  if (typeof status === 'boolean') {
    normalizedStatus = status ? 'true' : 'false';
  } else {
    normalizedStatus = Object.values(UserStatus).includes(status as UserStatus)
      ? (status as UserStatus)
      : Object.values(UserDriverStatus).includes(status as UserDriverStatus)
        ? (status as UserDriverStatus)
        : 'unknown';
  }

  const config =
    statusConfig[normalizedStatus as keyof typeof statusConfig] || statusConfig.unknown;

  return (
    <div className={cn('badge badge-sm badge-outline', config.color, className)}>
      {config.label}
    </div>
  );
};

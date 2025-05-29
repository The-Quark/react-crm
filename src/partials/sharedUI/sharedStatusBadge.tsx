import { cn } from '@/lib/utils';
import { UserStatus, UserDriverStatus, TaskStatus, VehicleStatus } from '@/api/enums';

type StatusType = UserStatus | UserDriverStatus | TaskStatus | VehicleStatus | string;

interface StatusBadgeProps {
  status: StatusType | boolean;
  className?: string;
}

export const SharedStatusBadge = ({ status, className }: StatusBadgeProps) => {
  const statusConfig = {
    // User statuses
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
    // Driver statuses
    [UserDriverStatus.AVAILABLE]: {
      label: 'Available',
      color: 'badge-success'
    },
    // Task statuses
    [TaskStatus.TODO]: {
      label: 'To Do',
      color: 'badge-info'
    },
    [TaskStatus.CANCELLED]: {
      label: 'Cancelled',
      color: 'badge-secondary'
    },
    [TaskStatus.BLOCKED]: {
      label: 'Blocked',
      color: 'badge-danger'
    },
    [TaskStatus.COMPLETED]: {
      label: 'Completed',
      color: 'badge-success'
    },
    [TaskStatus.OUTDATED]: {
      label: 'Outdated',
      color: 'badge-warning'
    },
    [TaskStatus.PROGRESS]: {
      label: 'In Progress',
      color: 'badge-primary'
    },
    // Vehicle statuses
    [VehicleStatus.ONLINE]: {
      label: 'Online',
      color: 'badge-success'
    },
    [VehicleStatus.SERVICE]: {
      label: 'On Service',
      color: 'badge-info'
    },
    // Boolean statuses
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

  const allStatuses = [
    ...Object.values(UserStatus),
    ...Object.values(UserDriverStatus),
    ...Object.values(TaskStatus),
    ...Object.values(VehicleStatus)
  ];

  let normalizedStatus: keyof typeof statusConfig;

  if (typeof status === 'boolean') {
    normalizedStatus = status ? 'true' : 'false';
  } else if (allStatuses.includes(status as any)) {
    normalizedStatus = status as keyof typeof statusConfig;
  } else {
    normalizedStatus = 'unknown';
  }
  const config = statusConfig[normalizedStatus] || statusConfig.unknown;

  return (
    <div className={cn('badge badge-sm badge-outline', config.color, className)}>
      {config.label}
    </div>
  );
};

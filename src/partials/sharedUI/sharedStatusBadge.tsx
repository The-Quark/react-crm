import { cn } from '@/lib/utils';
import {
  UserStatus,
  UserDriverStatus,
  TaskStatus,
  VehicleStatus,
  ApplicationsStatus,
  OrderStatus
} from '@/api/enums';

type StatusType =
  | ApplicationsStatus
  | UserStatus
  | UserDriverStatus
  | TaskStatus
  | VehicleStatus
  | OrderStatus
  | string;

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
    // Application statuses
    [ApplicationsStatus.NEW]: {
      label: 'New',
      color: 'badge-info'
    },
    [ApplicationsStatus.RUNNING]: {
      label: 'Running',
      color: 'badge-primary'
    },
    [ApplicationsStatus.DECLINED]: {
      label: 'Declined',
      color: 'badge-danger'
    },
    // Application statuses
    [OrderStatus.EXPIRED]: {
      label: 'Expired',
      color: 'badge-warning'
    },
    [OrderStatus.BUY_FOR_SOMEONE]: {
      label: 'Buy for Someone',
      color: 'badge-info'
    },
    [OrderStatus.PACKAGE_AWAITING]: {
      label: 'Package Awaiting',
      color: 'badge-primary'
    },
    [OrderStatus.PACKAGE_RECEIVED]: {
      label: 'Package Received',
      color: 'badge-success'
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
    ...Object.values(VehicleStatus),
    ...Object.values(ApplicationsStatus),
    ...Object.values(OrderStatus)
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

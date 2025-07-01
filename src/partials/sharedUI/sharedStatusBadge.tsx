import { cn } from '@/utils/lib/utils.ts';
import {
  UserStatus,
  UserDriverStatus,
  TaskStatus,
  VehicleStatus,
  ApplicationsStatus,
  OrderStatus,
  CargoStatus,
  PackageStatus
} from '@/api/enums';

type StatusType =
  | ApplicationsStatus
  | UserStatus
  | UserDriverStatus
  | TaskStatus
  | VehicleStatus
  | OrderStatus
  | CargoStatus
  | PackageStatus
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
      color: 'badge-danger'
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
    // Order statuses
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
    [OrderStatus.REWEIGHING]: {
      label: 'Reweighing',
      color: 'badge-warning'
    },
    // Package statuses
    [PackageStatus.READY_FOR_SHIPMENT]: {
      label: 'Ready for Shipment',
      color: 'badge-info'
    },
    [PackageStatus.PACKED]: {
      label: 'Packed',
      color: 'badge-success'
    },
    [PackageStatus.DELIVERED_TO_PVZ]: {
      label: 'Delivered to PVZ',
      color: 'badge-success'
    },
    [PackageStatus.START_CUSTOM_CLEARANCE]: {
      label: 'Custom Clearance Started',
      color: 'badge-primary'
    },
    [PackageStatus.DONE_CUSTOM_CLEARANCE]: {
      label: 'Custom Clearance Done',
      color: 'badge-success'
    },
    [PackageStatus.AWAITING_CUSTOM_CLEARANCE_APPROVAL]: {
      label: 'Awaiting Clearance Approval',
      color: 'badge-warning'
    },
    [PackageStatus.READY_FOR_RECEIVE]: {
      label: 'Ready for Receive',
      color: 'badge-info'
    },
    [PackageStatus.TRANSFERRED_TO_COURIER]: {
      label: 'Transferred to Courier',
      color: 'badge-primary'
    },
    [PackageStatus.READY_FOR_TRANSFER_TO_PVZ]: {
      label: 'Ready for Transfer to PVZ',
      color: 'badge-info'
    },
    [PackageStatus.HEADING_TO_PVZ]: {
      label: 'Heading to PVZ',
      color: 'badge-primary'
    },
    [PackageStatus.HEADING_TO_RECEIVER]: {
      label: 'Heading to Receiver',
      color: 'badge-primary'
    },
    [PackageStatus.READY_FOR_DELIVERY]: {
      label: 'Ready for Delivery',
      color: 'badge-info'
    },
    [PackageStatus.DELIVERED]: {
      label: 'Delivered',
      color: 'badge-success'
    },
    [PackageStatus.DAMAGED]: {
      label: 'Damaged',
      color: 'badge-danger'
    },
    [PackageStatus.DELAYED]: {
      label: 'Delayed',
      color: 'badge-warning'
    },
    // Cargo statuses
    [CargoStatus.FORMED]: {
      label: 'Formed',
      color: 'badge-success'
    },
    [CargoStatus.ARRIVED_AIRPORT_RECEIVER]: {
      label: 'Arrived at Receiver Airport',
      color: 'badge-info'
    },
    [CargoStatus.ACCEPTED_AIRPORT_SENDER]: {
      label: 'Accepted at Sender Airport',
      color: 'badge-success'
    },
    [CargoStatus.AWAITING_ACCEPT_AIRPORT_SENDER]: {
      label: 'Awaiting Acceptance at Sender Airport',
      color: 'badge-warning'
    },
    [CargoStatus.ACCEPTED_TSW]: {
      label: 'Accepted by TSW',
      color: 'badge-success'
    },
    [CargoStatus.TRANSFERRED_TSW]: {
      label: 'Transferred by TSW',
      color: 'badge-primary'
    },
    ['express']: {
      label: 'Express',
      color: 'badge-danger'
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
    ...Object.values(OrderStatus),
    ...Object.values(PackageStatus),
    ...Object.values(CargoStatus)
  ];

  let normalizedStatus: keyof typeof statusConfig;

  if (typeof status === 'boolean') {
    normalizedStatus = status ? 'true' : 'false';
  } else if (status in statusConfig) {
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

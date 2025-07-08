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
    [OrderStatus.DRAFT]: {
      label: 'Draft',
      color: 'badge-secondary'
    },
    [OrderStatus.CREATED]: {
      label: 'Created',
      color: 'badge-info'
    },
    [OrderStatus.CONFIRMED]: {
      label: 'Confirmed',
      color: 'badge-primary'
    },
    [OrderStatus.PAYMENT_PENDING]: {
      label: 'Payment Pending',
      color: 'badge-warning'
    },
    [OrderStatus.PAID]: {
      label: 'Paid',
      color: 'badge-success'
    },
    [OrderStatus.PACKAGE_AWAITING]: {
      label: 'Package Awaiting',
      color: 'badge-info'
    },
    [OrderStatus.BUY_FOR_SOMEONE]: {
      label: 'Buy for Someone',
      color: 'badge-primary'
    },
    [OrderStatus.REWEIGHING]: {
      label: 'Reweighing',
      color: 'badge-warning'
    },
    [OrderStatus.PACKAGE_RECEIVED]: {
      label: 'Package Received',
      color: 'badge-success'
    },
    [OrderStatus.IN_PROCESSING]: {
      label: 'In Processing',
      color: 'badge-info'
    },
    [OrderStatus.READY_FOR_SHIPMENT]: {
      label: 'Ready for Shipment',
      color: 'badge-primary'
    },
    [OrderStatus.SHIPPED]: {
      label: 'Shipped',
      color: 'badge-success'
    },
    [OrderStatus.IN_TRANSIT]: {
      label: 'In Transit',
      color: 'badge-info'
    },
    [OrderStatus.ARRIVED_DESTINATION]: {
      label: 'Arrived Destination',
      color: 'badge-success'
    },
    [OrderStatus.READY_FOR_DELIVERY]: {
      label: 'Ready for Delivery',
      color: 'badge-primary'
    },
    [OrderStatus.DELIVERED]: {
      label: 'Delivered',
      color: 'badge-success'
    },
    [OrderStatus.PICKED_UP]: {
      label: 'Picked Up',
      color: 'badge-success'
    },
    [OrderStatus.ON_HOLD]: {
      label: 'On Hold',
      color: 'badge-warning'
    },
    [OrderStatus.EXPIRED]: {
      label: 'Expired',
      color: 'badge-danger'
    },
    [OrderStatus.CANCELLED_BY_CLIENT]: {
      label: 'Cancelled by Client',
      color: 'badge-danger'
    },
    [OrderStatus.CANCELLED_BY_SYSTEM]: {
      label: 'Cancelled by System',
      color: 'badge-danger'
    },
    [OrderStatus.REFUNDED]: {
      label: 'Refunded',
      color: 'badge-secondary'
    },
    [OrderStatus.DISPUTED]: {
      label: 'Disputed',
      color: 'badge-warning'
    },
    // Package statuses
    [PackageStatus.PACKAGE_FORMED]: {
      label: 'Package Formed',
      color: 'badge-primary'
    },
    [PackageStatus.PACKAGE_AWAITING_AIRPORT]: {
      label: 'Awaiting Airport',
      color: 'badge-warning'
    },
    [PackageStatus.PACKAGE_ACCEPTED_AIRPORT_SENDER]: {
      label: 'Accepted at Sender Airport',
      color: 'badge-success'
    },
    [PackageStatus.PACKAGE_IN_TRANSIT]: {
      label: 'In Transit',
      color: 'badge-info'
    },
    [PackageStatus.PACKAGE_ARRIVED_AIRPORT_RECEIVER]: {
      label: 'Arrived at Receiver Airport',
      color: 'badge-success'
    },
    [PackageStatus.PACKAGE_ACCEPTED_TSW]: {
      label: 'Accepted at TSW',
      color: 'badge-primary'
    },
    [PackageStatus.PACKAGE_TRANSFERRED_TSW]: {
      label: 'Transferred to Warehouse',
      color: 'badge-success'
    },
    [PackageStatus.START_CUSTOM_CLEARANCE]: {
      label: 'Customs Clearance Started',
      color: 'badge-primary'
    },
    [PackageStatus.AWAITING_CUSTOM_CLEARANCE_APPROVAL]: {
      label: 'Awaiting Customs Approval',
      color: 'badge-warning'
    },
    [PackageStatus.DONE_CUSTOM_CLEARANCE]: {
      label: 'Customs Cleared',
      color: 'badge-success'
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
      label: 'Ready for PVZ Transfer',
      color: 'badge-info'
    },
    [PackageStatus.HEADING_TO_PVZ]: {
      label: 'Heading to PVZ',
      color: 'badge-primary'
    },
    [PackageStatus.DELIVERED_TO_PVZ]: {
      label: 'Delivered to PVZ',
      color: 'badge-success'
    },
    [PackageStatus.HEADING_TO_RECEIVER]: {
      label: 'Heading to Receiver',
      color: 'badge-primary'
    },
    [PackageStatus.PARTIALLY_DELIVERED]: {
      label: 'Partially Delivered',
      color: 'badge-warning'
    },
    [PackageStatus.DAMAGED]: {
      label: 'Damaged',
      color: 'badge-danger'
    },
    [PackageStatus.LOST]: {
      label: 'Lost',
      color: 'badge-danger'
    },
    [PackageStatus.DELAYED]: {
      label: 'Delayed',
      color: 'badge-warning'
    },
    [PackageStatus.RETURNED]: {
      label: 'Returned',
      color: 'badge-secondary'
    },
    [PackageStatus.REJECTED]: {
      label: 'Rejected by Customs',
      color: 'badge-danger'
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

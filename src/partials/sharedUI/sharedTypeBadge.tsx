import { cn } from '@/utils/lib/utils.ts';
import { TaskType, VehicleType } from '@/api/enums';
import {
  Building2,
  ShoppingCart,
  FileText,
  Package,
  Users,
  CarFront,
  Truck,
  Bike,
  Package2,
  Car
} from 'lucide-react';

interface TypeBadgeProps {
  type: TaskType | VehicleType | string;
  className?: string;
  showIcon?: boolean;
}

export const SharedTypeBadge = ({ type, className, showIcon = true }: TypeBadgeProps) => {
  const typeConfig = {
    [TaskType.INNER]: {
      label: 'Inner',
      color: 'badge-warning',
      icon: Building2
    },
    [TaskType.ORDERS]: {
      label: 'Orders',
      color: 'badge-info',
      icon: ShoppingCart
    },
    [TaskType.APPLICATIONS]: {
      label: 'Applications',
      color: 'badge-info',
      icon: FileText
    },
    [TaskType.PACKAGES]: {
      label: 'Packages',
      color: 'badge-info',
      icon: Package
    },
    [TaskType.DELIVERY]: {
      label: 'Delivery',
      color: 'badge-info',
      icon: Package2
    },
    [TaskType.DRIVER]: {
      label: 'Driver',
      color: 'badge-info',
      icon: Car
    },
    [TaskType.COURIER]: {
      label: 'Courier',
      color: 'badge-info',
      icon: Bike
    },
    [TaskType.USERS]: {
      label: 'Users',
      color: 'badge-primary',
      icon: Users
    },
    [VehicleType.VAN]: {
      label: 'VAN',
      color: 'badge-info',
      icon: Truck
    },
    [VehicleType.AUTO]: {
      label: 'AUTO',
      color: 'badge-primary',
      icon: CarFront
    },
    [VehicleType.MOTORBIKE]: {
      label: 'Motorbike',
      color: 'badge-warning',
      icon: Bike
    },
    unknown: {
      label: String(type),
      color: 'badge-default',
      icon: FileText
    }
  };

  const taskTypes = Object.values(TaskType);
  const vehicleTypes = Object.values(VehicleType);

  let normalizedType: keyof typeof typeConfig;

  if (taskTypes.includes(type as TaskType)) {
    normalizedType = type as TaskType;
  } else if (vehicleTypes.includes(type as VehicleType)) {
    normalizedType = type as VehicleType;
  } else {
    normalizedType = 'unknown';
  }

  const config = typeConfig[normalizedType] || typeConfig.unknown;
  const IconComponent = config.icon;

  return (
    <div
      className={cn(
        'badge badge-sm badge-outline flex items-center gap-1',
        config.color,
        className
      )}
    >
      {showIcon && <IconComponent size={12} />}
      {config.label}
    </div>
  );
};

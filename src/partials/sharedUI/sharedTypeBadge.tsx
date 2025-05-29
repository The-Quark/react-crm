import { cn } from '@/lib/utils';
import { TaskType } from '@/api/enums';
import { Building2, ShoppingCart, FileText, Package, Users } from 'lucide-react';

interface TypeBadgeProps {
  type: TaskType | string;
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
    [TaskType.USERS]: {
      label: 'Users',
      color: 'badge-primary',
      icon: Users
    },
    unknown: {
      label: String(type),
      color: 'badge-default',
      icon: FileText
    }
  };

  const allTypes = Object.values(TaskType);

  let normalizedType: keyof typeof typeConfig;

  if (allTypes.includes(type as TaskType)) {
    normalizedType = type as TaskType;
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

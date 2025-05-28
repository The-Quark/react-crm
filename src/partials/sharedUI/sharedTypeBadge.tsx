import { cn } from '@/lib/utils';
import { TaskType } from '@/api/enums';
import { Building2, ShoppingCart, FileText, Package, Users } from 'lucide-react';

interface TypeBadgeProps {
  type: TaskType | string;
  className?: string;
  showIcon?: boolean;
  variant?: 'default' | 'solid' | 'gradient';
}

export const SharedTypeBadge = ({
  type,
  className,
  showIcon = true,
  variant = 'default'
}: TypeBadgeProps) => {
  const typeConfig = {
    [TaskType.INNER]: {
      label: 'Inner',
      color: 'text-purple-700 bg-purple-50 border-purple-200 hover:bg-purple-100',
      solidColor: 'text-white bg-purple-600 hover:bg-purple-700',
      gradientColor:
        'text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      icon: Building2
    },
    [TaskType.ORDERS]: {
      label: 'Orders',
      color: 'text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100',
      solidColor: 'text-white bg-blue-600 hover:bg-blue-700',
      gradientColor:
        'text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      icon: ShoppingCart
    },
    [TaskType.APPLICATIONS]: {
      label: 'Applications',
      color: 'text-green-700 bg-green-50 border-green-200 hover:bg-green-100',
      solidColor: 'text-white bg-green-600 hover:bg-green-700',
      gradientColor:
        'text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      icon: FileText
    },
    [TaskType.PACKAGES]: {
      label: 'Packages',
      color: 'text-orange-700 bg-orange-50 border-orange-200 hover:bg-orange-100',
      solidColor: 'text-white bg-orange-600 hover:bg-orange-700',
      gradientColor:
        'text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
      icon: Package
    },
    [TaskType.USERS]: {
      label: 'Users',
      color: 'text-indigo-700 bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
      solidColor: 'text-white bg-indigo-600 hover:bg-indigo-700',
      gradientColor:
        'text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700',
      icon: Users
    },
    unknown: {
      label: String(type),
      color: 'text-gray-700 bg-gray-50 border-gray-200 hover:bg-gray-100',
      solidColor: 'text-white bg-gray-600 hover:bg-gray-700',
      gradientColor:
        'text-white bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700',
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

  const getColorClass = () => {
    switch (variant) {
      case 'solid':
        return config.solidColor;
      case 'gradient':
        return config.gradientColor;
      default:
        return config.color;
    }
  };

  const baseClasses = cn(
    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium',
    'transition-all duration-200 ease-in-out',
    'shadow-sm hover:shadow-md',
    variant === 'default' && 'border',
    getColorClass(),
    className
  );

  return (
    <div className={baseClasses}>
      {showIcon && <IconComponent size={12} className="flex-shrink-0" />}
      <span className="truncate">{config.label}</span>
    </div>
  );
};

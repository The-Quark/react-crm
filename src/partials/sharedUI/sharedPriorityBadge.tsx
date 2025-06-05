import { cn } from '@/lib/utils';
import { TaskPriority } from '@/api/enums';
import { ArrowDown, Minus, ArrowUp, AlertTriangle } from 'lucide-react';

interface PriorityBadgeProps {
  priority: TaskPriority | string;
  className?: string;
  showIcon?: boolean;
}

export const SharedPriorityBadge = ({
  priority,
  className,
  showIcon = true
}: PriorityBadgeProps) => {
  const priorityConfig = {
    [TaskPriority.LOW]: {
      label: 'Low',
      color: 'badge-success',
      icon: ArrowDown
    },
    [TaskPriority.NORMAL]: {
      label: 'Normal',
      color: 'badge-info',
      icon: Minus
    },
    [TaskPriority.HIGH]: {
      label: 'High',
      color: 'badge-danger',
      icon: ArrowUp
    },
    [TaskPriority.URGENT]: {
      label: 'Urgent',
      color: 'badge-danger',
      icon: AlertTriangle
    },
    unknown: {
      label: String(priority),
      color: 'badge-default',
      icon: Minus
    }
  };

  const allPriorities = Object.values(TaskPriority);

  let normalizedPriority: keyof typeof priorityConfig;

  if (allPriorities.includes(priority as TaskPriority)) {
    normalizedPriority = priority as TaskPriority;
  } else {
    normalizedPriority = 'unknown';
  }

  const config = priorityConfig[normalizedPriority] || priorityConfig.unknown;
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

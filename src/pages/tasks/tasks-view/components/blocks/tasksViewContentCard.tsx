import React, { FC } from 'react';
import { Task } from '@/api/get/getTask/types.ts';
import { formatDate } from '@/utils/lib/utils.ts';
import { useIntl } from 'react-intl';
import { SharedStatusBadge } from '@/partials/sharedUI/sharedStatusBadge.tsx';
import { SharedPriorityBadge, SharedTypeBadge } from '@/partials/sharedUI';

interface IGeneralSettingsProps {
  task: Task | null;
}

export const TasksViewContentCard: FC<IGeneralSettingsProps> = ({ task }) => {
  const { formatMessage } = useIntl();

  if (!task)
    return (
      <div className="card bg-card text-card-foreground rounded-xl shadow-lg p-6 text-center">
        {formatMessage({ id: 'SYSTEM.EMPTY_STATE' })}
      </div>
    );

  const renderUserInfo = (user: {
    first_name: string;
    last_name: string;
    patronymic: string;
    email: string;
    phone: string;
  }) => (
    <div className="space-y-1">
      <p className="text-sm font-medium capitalize">{`${user?.first_name} ${user?.last_name} ${user?.patronymic}`}</p>
      <p className="text-xs text-muted-foreground">{user?.email}</p>
      <p className="text-xs text-muted-foreground">{user?.phone}</p>
    </div>
  );

  return (
    <div className="card bg-card text-card-foreground rounded-xl shadow-lg p-6 max-w-5xl mx-auto transition-all duration-300">
      <div className="border-b pb-4 mb-6">
        <h3 className="text-xl font-bold text-foreground">
          {formatMessage({ id: 'SYSTEM.TASKS' })}
        </h3>
      </div>
      <div className="space-y-6">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
              <label className="text-sm font-semibold text-foreground min-w-[100px]">
                {formatMessage({ id: 'SYSTEM.TITLE' })}:
              </label>
              <div className="text-sm font-medium">{task.title}</div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
              <label className="text-sm font-semibold text-foreground min-w-[100px]">
                {formatMessage({ id: 'SYSTEM.DUE_DATE' })}:
              </label>
              <div className="text-sm">{formatDate(task.due_date)}</div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
              <label className="text-sm font-semibold text-foreground min-w-[100px]">
                {formatMessage({ id: 'SYSTEM.CREATED_AT' })}:
              </label>
              <div className="text-sm">{formatDate(task.created_at)}</div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
              <label className="text-sm font-semibold text-foreground min-w-[100px]">
                {formatMessage({ id: 'SYSTEM.LAST_UPDATED' })}:
              </label>
              <div className="text-sm">{formatDate(task.updated_at)}</div>
            </div>
          </div>
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
              <label className="text-sm font-semibold text-foreground min-w-[100px]">
                {formatMessage({ id: 'SYSTEM.STATUS' })}:
              </label>
              <SharedStatusBadge status={task.status} />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
              <label className="text-sm font-semibold text-foreground min-w-[100px]">
                {formatMessage({ id: 'SYSTEM.PRIORITY' })}:
              </label>
              <SharedPriorityBadge priority={task.priority} />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
              <label className="text-sm font-semibold text-foreground min-w-[100px]">
                {formatMessage({ id: 'SYSTEM.TYPE' })}:
              </label>
              <SharedTypeBadge type={task.type} />
            </div>
          </div>
        </div>
        <div className="space-y-2 p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-foreground">
              {formatMessage({ id: 'SYSTEM.NOTES' })}
            </label>
            <div className="text-sm">
              {task.description || formatMessage({ id: 'SYSTEM.EMPTY_STATE' })}
            </div>
          </div>
        </div>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                {formatMessage({ id: 'SYSTEM.ASSIGNED_BY' })}
              </label>
              {task.assigned_by &&
                renderUserInfo({
                  ...task.assigned_by,
                  patronymic: task.assigned_by.patronymic ?? ''
                })}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                {formatMessage({ id: 'SYSTEM.ASSIGNED_TO' })}
              </label>
              {task.assigned_to &&
                renderUserInfo({
                  ...task.assigned_to,
                  patronymic: task.assigned_to.patronymic ?? ''
                })}
            </div>
          </div>
        </div>
        {task.order && (
          <div className="space-y-2 p-4 rounded-lg border border-gray-200 shadow-sm">
            <label className="text-sm font-semibold text-foreground">
              {formatMessage({ id: 'SYSTEM.ORDER' })}
            </label>
            <div className="space-y-1 text-sm">
              <div className="flex gap-1 items-center">
                {formatMessage({ id: 'SYSTEM.CODE' })}:
                <a
                  className="text-primary hover:underline"
                  href={`/call-center/orders/list/id=${task.order.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {task.order.order_code}
                </a>
              </div>
              <p>
                {formatMessage({ id: 'SYSTEM.STATUS' })}: {task.order.status}
              </p>
              <p>
                {formatMessage({ id: 'SYSTEM.DELIVERY_CATEGORY' })}: {task.order.delivery_category}
              </p>
              <p>
                {formatMessage({ id: 'SYSTEM.CREATED_AT' })}: {formatDate(task.order.created_at)}
              </p>
            </div>
          </div>
        )}
        {task.package && (
          <div className="space-y-2 p-4 rounded-lg border border-gray-200 shadow-sm">
            <label className="text-sm font-semibold text-foreground">
              {formatMessage({ id: 'SYSTEM.PACKAGE_DETAILS' })}
            </label>
            <div className="space-y-1 text-sm">
              <div className="flex gap-1 items-center">
                {formatMessage({ id: 'SYSTEM.HAWB' })}:
                <a
                  className="text-primary hover:underline"
                  href={`/warehouse/packages/list/id=${task.package.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {task.package.hawb}
                </a>
              </div>
              <p>
                {formatMessage({ id: 'SYSTEM.WEIGHT' })}: {task.package.weight}
              </p>
              <p>
                {formatMessage({ id: 'SYSTEM.DIMENSIONS' })}: {task.package.dimensions}
              </p>
              <p>
                {formatMessage({ id: 'SYSTEM.STATUS' })}: {task.package.status}
              </p>
            </div>
          </div>
        )}
        {task.client && (
          <div className="space-y-2 p-4 rounded-lg border border-gray-200 shadow-sm">
            <label className="text-sm font-semibold text-foreground">
              {formatMessage({ id: 'SYSTEM.CLIENT' })}
            </label>
            <div className="space-y-1 text-sm">
              <p>
                {task.client.first_name} {task.client.last_name}
                {task.client.company_name && ` (${task.client.company_name})`}
              </p>
              <p>{task.client.phone}</p>
              <p>{task.client.email}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

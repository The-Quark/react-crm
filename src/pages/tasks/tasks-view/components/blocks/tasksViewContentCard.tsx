import { FC } from 'react';
import { Task } from '@/api/get/getTask/types.ts';
import { formatDate } from '@/utils/lib/utils.ts';
import { useIntl } from 'react-intl';

interface IGeneralSettingsProps {
  task: Task | null;
}

export const TasksViewContentCard: FC<IGeneralSettingsProps> = ({ task }) => {
  const { formatMessage } = useIntl();

  if (!task)
    return (
      <div className="card bg-card text-card-foreground">
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
    <div>
      <p className="capitalize text-sm">{`${user?.first_name} ${user?.last_name} ${user?.patronymic}`}</p>
      <p className="text-sm text-muted-foreground">{user?.email}</p>
      <p className="text-sm text-muted-foreground">{user?.phone}</p>
    </div>
  );

  return (
    <div className="card bg-card text-card-foreground pb-4 shadow-sm">
      <div className="card-header p-4 border-b" id="general_settings">
        <h3 className="card-title text-lg font-semibold">
          {formatMessage({ id: 'SYSTEM.TASKS' })}
        </h3>
      </div>
      <div className="card-body p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-baseline gap-2.5">
              <label className="text-md font-bold min-w-32">
                {formatMessage({ id: 'SYSTEM.NAME' })}:
              </label>
              <div className="font-medium text-sm">{task.title}</div>
            </div>

            <div className="flex items-baseline gap-2.5">
              <label className="text-md font-bold min-w-32">
                {formatMessage({ id: 'SYSTEM.STATUS' })}:
              </label>
              <div className="capitalize text-sm">{task.status.replace('_', ' ')}</div>
            </div>

            <div className="flex items-baseline gap-2.5">
              <label className="text-md font-bold min-w-32">
                {formatMessage({ id: 'SYSTEM.PRIORITY' })}:
              </label>
              <div className="capitalize text-sm">{task.priority}</div>
            </div>

            <div className="flex items-baseline gap-2.5">
              <label className="text-md font-bold min-w-32">
                {formatMessage({ id: 'SYSTEM.TYPE' })}:
              </label>
              <div className="capitalize text-sm">{task.type}</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-baseline gap-2.5">
              <label className="text-md font-bold min-w-32">
                {formatMessage({ id: 'SYSTEM.PICK_DATE' })}:
              </label>
              <div className="capitalize text-sm">{formatDate(task.due_date)}</div>
            </div>

            <div className="flex items-baseline gap-2.5">
              <label className="text-md font-bold min-w-32">
                {formatMessage({ id: 'SYSTEM.CREATED_AT' })}:
              </label>
              <div className="capitalize text-sm">{formatDate(task.created_at)}</div>
            </div>

            <div className="flex items-baseline gap-2.5">
              <label className="text-md font-bold min-w-32">
                {formatMessage({ id: 'SYSTEM.LAST_UPDATED' }) ?? 'Last Updated'}:
              </label>
              <div className="capitalize text-sm">{formatDate(task.updated_at)}</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-md font-bold">{formatMessage({ id: 'SYSTEM.NOTES' })}</label>
          <div className="capitalize text-sm">
            {task.description || formatMessage({ id: 'SYSTEM.EMPTY_STATE' })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-md font-bold">
              {formatMessage({ id: 'SYSTEM.ASSIGNED_BY' })}
            </label>
            {renderUserInfo(task.assigned_by)}
          </div>

          <div className="space-y-2">
            <label className="text-md font-bold">
              {formatMessage({ id: 'SYSTEM.ASSIGNED_TO' })}
            </label>
            {renderUserInfo(task?.assigned_to)}
          </div>
        </div>

        {task.order && (
          <div className="space-y-2">
            <label className="text-md font-bold">{formatMessage({ id: 'SYSTEM.ORDER' })}</label>
            <div className="space-y-1">
              <p className="capitalize text-sm">{task.order.order_code}</p>
              <p className="capitalize text-sm">
                {formatMessage({ id: 'SYSTEM.STATUS' })}: {task.order.status}
              </p>
              <p className="capitalize text-sm">
                {formatMessage({ id: 'SYSTEM.DELIVERY_CATEGORY' })}: {task.order.delivery_category}
              </p>
              <p className="capitalize text-sm">
                {formatMessage({ id: 'SYSTEM.CREATED_AT' })}: {formatDate(task.order.created_at)}
              </p>
            </div>
          </div>
        )}

        {task.client && (
          <div className="space-y-2">
            <label className="text-md font-bold">{formatMessage({ id: 'SYSTEM.CLIENT' })}</label>
            <div className="space-y-1">
              <p className="capitalize text-sm">
                {task.client.first_name} {task.client.last_name}
                {task.client.company_name && ` (${task.client.company_name})`}
              </p>
              <p className="capitalize text-sm">{task.client.phone}</p>
              <p className="capitalize text-sm">{task.client.email}</p>
            </div>
          </div>
        )}

        {task.package && (
          <div className="space-y-2">
            <label className="text-md font-bold">
              {formatMessage({ id: 'SYSTEM.PACKAGE_DETAILS' })}
            </label>
            <div className="space-y-1">
              <p className="capitalize text-sm">
                {formatMessage({ id: 'SYSTEM.HAWB' })}: {task.package.hawb}
              </p>
              <p className="capitalize text-sm">
                {formatMessage({ id: 'SYSTEM.WEIGHT' })}: {task.package.weight}
              </p>
              <p className="capitalize text-sm">
                {formatMessage({ id: 'SYSTEM.DIMENSIONS' })}: {task.package.dimensions}
              </p>
              <p className="capitalize text-sm">
                {formatMessage({ id: 'SYSTEM.STATUS' })}: {task.package.status}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

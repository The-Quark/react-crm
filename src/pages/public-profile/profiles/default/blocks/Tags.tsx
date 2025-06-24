import clsx from 'clsx';
import { useCurrentUser } from '@/api';
import { useIntl } from 'react-intl';

interface ITagsItem {
  label: string;
  name?: string;
  nicename?: string | null;
}

interface ITagsProps {
  title: string;
  className?: string;
}

const Tags = ({ title, className }: ITagsProps) => {
  const { formatMessage } = useIntl();
  const { data: currentUser } = useCurrentUser();

  const permissionItems: ITagsItem[] =
    currentUser?.permissions?.map((permission) => ({
      label:
        permission.nicename ||
        permission.name ||
        formatMessage({ id: 'SYSTEM.UNNAMED_PERMISSION' }),
      name: permission.name,
      nicename: permission.nicename
    })) || [];

  const roleItems: ITagsItem[] =
    currentUser?.roles?.map((role) => ({
      label: role.nicename || role.name || formatMessage({ id: 'SYSTEM.UNNAMED_ROLE' }),
      name: role.name,
      nicename: role.nicename
    })) || [];

  const renderItem = (item: ITagsItem, index: number) => {
    return (
      <span
        key={`${item.name}-${index}`}
        className="badge badge-sm badge-gray-200 mr-2 mb-2"
        title={item.name}
      >
        {item.label}
      </span>
    );
  };

  return (
    <div className={clsx('card', className)}>
      <div className="card-header">
        <h3 className="card-title"> {title || formatMessage({ id: 'SYSTEM.TAGS_TITLE' })}</h3>
      </div>

      <div className="card-body">
        {permissionItems.length > 0 && (
          <>
            <h4 className="text-sm font-medium mb-2">
              {' '}
              {formatMessage({ id: 'SYSTEM.PERMISSIONS' })}
            </h4>
            <div className="flex flex-wrap gap-2 mb-4">{permissionItems.map(renderItem)}</div>
          </>
        )}

        {roleItems.length > 0 && (
          <>
            <h4 className="text-sm font-medium mb-2"> {formatMessage({ id: 'SYSTEM.ROLES' })}</h4>
            <div className="flex flex-wrap gap-2">{roleItems.map(renderItem)}</div>
          </>
        )}
      </div>
    </div>
  );
};

export { Tags, type ITagsItem, type ITagsProps };

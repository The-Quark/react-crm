import clsx from 'clsx';
import { Fragment } from 'react';

interface ITagsItem {
  label: string;
  name?: string;
  nicename?: string | null;
}

interface ITagsProps {
  className?: string;
  roles: Array<{
    name: string;
    nicename: string | null;
  }>;
  permissions: Array<{
    name: string;
    nicename: string | null;
  }>;
}

export const UsersPublicProfileACL = ({ className, roles, permissions }: ITagsProps) => {
  // Transform permissions data into ITagsItem format
  const permissionItems: ITagsItem[] =
    permissions?.map((permission) => ({
      label: permission.nicename || permission.name || 'Unnamed Permission',
      name: permission.name,
      nicename: permission.nicename
    })) || [];

  // Transform roles data into ITagsItem format
  const roleItems: ITagsItem[] =
    roles?.map((role) => ({
      label: role.nicename || role.name || 'Unnamed Role',
      name: role.name,
      nicename: role.nicename
    })) || [];

  const renderItem = (item: ITagsItem, index: number) => {
    return (
      <span
        key={`${item.name}-${index}`}
        className="badge badge-sm badge-gray-200 mr-2 mb-2"
        title={item.name} // Show the technical name on hover
      >
        {item.label}
      </span>
    );
  };

  return (
    <div className={clsx('card', className)}>
      <div className="card-header">
        <h3 className="card-title">Access Control</h3>
      </div>

      <div className="card-body">
        {permissionItems.length > 0 && (
          <Fragment>
            <h4 className="text-sm font-medium mb-2">Permissions</h4>
            <div className="flex flex-wrap gap-2 mb-4">{permissionItems.map(renderItem)}</div>
          </Fragment>
        )}

        {roleItems.length > 0 && (
          <Fragment>
            <h4 className="text-sm font-medium mb-2">Roles</h4>
            <div className="flex flex-wrap gap-2">{roleItems.map(renderItem)}</div>
          </Fragment>
        )}

        {permissionItems.length === 0 && roleItems.length === 0 && (
          <p className="text-gray-500">No access control information available</p>
        )}
      </div>
    </div>
  );
};

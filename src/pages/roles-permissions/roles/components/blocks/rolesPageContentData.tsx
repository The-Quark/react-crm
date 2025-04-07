import { CardAddNew, CardRole } from '@/partials/cards';
import { useEffect, useState } from 'react';
import { getRoles } from '@/api/getRoles';
import { Role } from '@/api/getRoles/types.ts';
import { CircularProgress } from '@mui/material';
import { KeenIcon } from '@/components';

export const RolesPageContentData = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getRoles()
      .then((roles) => {
        setRoles(roles.result);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const renderItem = (item: Role, index: number) => {
    return (
      <CardRole
        key={index}
        title={item.nicename ? item.nicename : `${item.name[0].toUpperCase()}${item.name.slice(1)}`}
        description={
          item.description ? item.description : item.permissions.map((perm) => perm.name).join(', ')
        }
        subTitle={`${item.users_count} users`}
        path="/crm/roles"
        badge={{
          size: 'size-[44px]',
          badge: <KeenIcon icon="face-id" className="text-1.5xl text-success" />,
          fill: 'fill-success-light',
          stroke: 'stroke-success-clarity'
        }}
      />
    );
  };

  return loading ? (
    <div className="flex justify-center items-center p-5">
      <CircularProgress />
    </div>
  ) : (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-7.5">
      {roles.map((item, index) => {
        return renderItem(item, index);
      })}

      <CardAddNew
        path="/crm/roles"
        size="size-[60px]"
        iconSize="text-2xl"
        title="Add New Role"
        subTitle="Ignite Professional Adventures"
      />
    </div>
  );
};

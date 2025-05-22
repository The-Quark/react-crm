import { CardRole } from '@/partials/cards';
import { getRoles } from '@/api/get/getRoles';
import { Role } from '@/api/get/getRoles/types.ts';
import { CircularProgress } from '@mui/material';
import { KeenIcon } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { SharedError } from '@/partials/sharedUI';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';

export const RolesListPageContent = () => {
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManage = has('manage role') || currentUser?.roles[0].name === 'superadmin';
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['roles'],
    queryFn: () => getRoles(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });

  if (isError) {
    <SharedError error={error} />;
  }

  const renderItem = (item: Role, index: number) => {
    return (
      <CardRole
        key={index}
        title={item.nicename ? item.nicename : `${item.name[0].toUpperCase()}${item.name.slice(1)}`}
        description={
          item.description ? item.description : item.permissions.map((perm) => perm.name).join(', ')
        }
        subTitle={`${item.users_count} users`}
        path={
          canManage
            ? `/roles-permissions/roles/starter/${item.name}`
            : '/roles-permissions/roles/list'
        }
        badge={{
          size: 'size-[44px]',
          badge: <KeenIcon icon="face-id" className="text-1.5xl text-success" />,
          fill: 'fill-success-light',
          stroke: 'stroke-success-clarity'
        }}
        disableMenu
      />
    );
  };

  return isLoading ? (
    <div className="flex justify-center items-center p-5">
      <CircularProgress />
    </div>
  ) : (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-7.5">
      {data?.result.map((item, index) => {
        return renderItem(item, index);
      })}
    </div>
  );
};

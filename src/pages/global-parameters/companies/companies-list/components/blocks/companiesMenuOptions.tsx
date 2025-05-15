import {
  KeenIcon,
  MenuIcon,
  MenuItem,
  MenuLink,
  MenuSeparator,
  MenuSub,
  MenuTitle
} from '@/components';
import { FC } from 'react';
import { toast } from 'sonner';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { deleteGlobalParameter } from '@/api';
import { useQueryClient } from '@tanstack/react-query';

interface MenuOptionsProps {
  id?: number;
}

const ParameterMenuOptions: FC<MenuOptionsProps> = ({ id }) => {
  const { currentUser } = useAuthContext();
  const queryClient = useQueryClient();
  const { has } = useUserPermissions();
  const canManageGlobalSettings =
    has('manage global settings') || currentUser?.roles[0].name === 'superadmin';

  const handleDelete = () => {
    if (id) {
      deleteGlobalParameter(id);
      queryClient.invalidateQueries({ queryKey: ['global-parameters'] });
    } else {
      toast.error('Parameter ID not provided');
    }
  };

  return (
    <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
      <MenuItem>
        <MenuLink path={`/global-parameters/view-parameters/${id}`}>
          <MenuIcon>
            <KeenIcon icon="more-2" />
          </MenuIcon>
          <MenuTitle>View</MenuTitle>
        </MenuLink>
      </MenuItem>
      {canManageGlobalSettings && (
        <>
          <MenuItem>
            <MenuLink path={`/global-parameters/starter-parameters/${id}`}>
              <MenuIcon>
                <KeenIcon icon="setting-4" />
              </MenuIcon>
              <MenuTitle>Edit</MenuTitle>
            </MenuLink>
          </MenuItem>
          <MenuSeparator />
          <MenuItem onClick={handleDelete}>
            <MenuLink>
              <MenuIcon>
                <KeenIcon icon="trash" className="text-danger !text-red-500" />
              </MenuIcon>
              <MenuTitle className="text-danger !text-red-500">Delete</MenuTitle>
            </MenuLink>
          </MenuItem>
        </>
      )}
    </MenuSub>
  );
};

export { ParameterMenuOptions };

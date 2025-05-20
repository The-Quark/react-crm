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
import { deleteUser } from '@/api';
import { useQueryClient } from '@tanstack/react-query';

interface MenuOptionsProps {
  id?: number;
}

export const DriversMenuOptions: FC<MenuOptionsProps> = ({ id }) => {
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManage = has('manage users') || currentUser?.roles[0].name === 'superadmin';
  const queryClient = useQueryClient();

  const handleDelete = () => {
    if (id) {
      deleteUser(id);
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
    } else {
      toast.error('Driver ID not provided');
    }
  };

  return (
    <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
      <MenuItem>
        <MenuLink path={`/crm/users/public-profile/${id}`}>
          <MenuIcon>
            <KeenIcon icon="user" />
          </MenuIcon>
          <MenuTitle>View Profile</MenuTitle>
        </MenuLink>
      </MenuItem>
      {canManage && (
        <>
          <MenuItem>
            <MenuLink path={`/hr-module/drivers/starter/${id}`}>
              <MenuIcon>
                <KeenIcon icon="user-edit" />
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

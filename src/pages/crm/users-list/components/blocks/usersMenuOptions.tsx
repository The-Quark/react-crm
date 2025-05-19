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

export const UsersMenuOptions: FC<MenuOptionsProps> = ({ id }) => {
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManage = has('manage users') || currentUser?.roles[0].name === 'superadmin';
  const queryClient = useQueryClient();

  const handleDelete = () => {
    if (id) {
      deleteUser(id);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } else {
      toast.error('User ID not provided');
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
            <MenuLink path={`/crm/users/starter/${id}`}>
              <MenuIcon>
                <KeenIcon icon="user-edit" />
              </MenuIcon>
              <MenuTitle>Edit user</MenuTitle>
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink path={`/crm/member-role-update/${id}`}>
              <MenuIcon>
                <KeenIcon icon="briefcase" />
              </MenuIcon>
              <MenuTitle>Edit role</MenuTitle>
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

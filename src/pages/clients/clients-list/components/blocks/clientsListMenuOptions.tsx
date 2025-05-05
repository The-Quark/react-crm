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
import { deleteClient } from '@/api';
import { useQueryClient } from '@tanstack/react-query';

interface ParameterMenuOptionsProps {
  id?: number;
}

const ClientsListMenuOptions: FC<ParameterMenuOptionsProps> = ({ id }) => {
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManage = has('manage clients') || currentUser?.roles[0].name === 'superadmin';
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!id) {
      toast.error('ID not provided');
      return;
    }
    try {
      await deleteClient(id);
      await queryClient.invalidateQueries({ queryKey: ['clients'] });
    } catch {
      toast.error('ID not provided');
    }
  };

  return (
    <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
      {canManage && (
        <>
          <MenuItem>
            <MenuLink path={`/clients/starter-clients/${id}`}>
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

export { ClientsListMenuOptions };

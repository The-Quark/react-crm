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

interface ParameterMenuOptionsProps {
  id?: number;
}

const ClientsListMenuOptions: FC<ParameterMenuOptionsProps> = ({ id }) => {
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManage = has('manage clients') || currentUser?.roles[0].name === 'superadmin';

  const handleDelete = () => {
    if (id) {
      deleteClient(id);
    } else {
      toast.error('ID not provided');
    }
  };

  return (
    <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
      <MenuItem>
        <MenuLink path={`#`}>
          <MenuIcon>
            <KeenIcon icon="user" />
          </MenuIcon>
          <MenuTitle>View</MenuTitle>
        </MenuLink>
      </MenuItem>
      {canManage && (
        <>
          <MenuItem>
            <MenuLink path={`/call-center/orders/starter/${id}`}>
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

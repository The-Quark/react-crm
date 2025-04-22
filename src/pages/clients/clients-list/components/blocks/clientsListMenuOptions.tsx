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

interface ParameterMenuOptionsProps {
  id?: number;
  handleReload: () => void;
}

const ClientsListMenuOptions: FC<ParameterMenuOptionsProps> = ({ id, handleReload }) => {
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManageClientsSettings =
    has('manage clients') || currentUser?.roles[0].name === 'superadmin';

  const handleDelete = () => {
    if (id) {
      deleteGlobalParameter(id);
      setTimeout(() => {
        handleReload();
      }, 500);
    } else {
      toast.error('Parameter ID not provided');
    }
  };

  return (
    <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
      <MenuItem>
        <MenuLink path={`#`}>
          <MenuIcon>
            <KeenIcon icon="user" />
          </MenuIcon>
          <MenuTitle>View Client</MenuTitle>
        </MenuLink>
      </MenuItem>
      {canManageClientsSettings && (
        <>
          <MenuItem>
            <MenuLink path={`#`}>
              <MenuIcon>
                <KeenIcon icon="user-edit" />
              </MenuIcon>
              <MenuTitle>Edit Client</MenuTitle>
            </MenuLink>
          </MenuItem>
          <MenuSeparator />
          <MenuItem>
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

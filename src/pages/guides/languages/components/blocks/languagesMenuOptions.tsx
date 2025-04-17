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
import axios from 'axios';
import { toast } from 'sonner';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';

interface ParameterMenuOptionsProps {
  id?: number;
  handleReload: () => void;
}

const API_URL = import.meta.env.VITE_APP_API_URL;
const LANGUAGE_DELETE_URL = `${API_URL}/language/manage`;

const deleteParameter = async (id: number) => {
  try {
    await axios.delete(`${LANGUAGE_DELETE_URL}/?id=${id}`);
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};
const LanguagesMenuOptions: FC<ParameterMenuOptionsProps> = ({ id, handleReload }) => {
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManageGlobalSettings =
    has('manage global settings') || currentUser?.roles[0].name === 'superadmin';

  const handleDelete = () => {
    if (id) {
      deleteParameter(id);
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
        <MenuLink path={`/global-parameters/view-parameters/${id}`}>
          <MenuIcon>
            <KeenIcon icon="more-2" />
          </MenuIcon>
          <MenuTitle>View Language</MenuTitle>
        </MenuLink>
      </MenuItem>
      {canManageGlobalSettings && (
        <>
          <MenuItem>
            <MenuLink path={`/global-parameters/update-parameters/${id}`}>
              <MenuIcon>
                <KeenIcon icon="setting-4" />
              </MenuIcon>
              <MenuTitle>Edit Language</MenuTitle>
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

export { LanguagesMenuOptions };

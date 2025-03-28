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

interface MemberMenuOptionsProps {
  id?: number;
  handleReload: () => void;
}

const API_URL = import.meta.env.VITE_APP_API_URL;
const USER_DELETE_URL = `${API_URL}/users/manage`;

const deleteUser = async (id: number) => {
  try {
    await axios.delete(`${USER_DELETE_URL}/?id=${id}`);
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};
const MemberMenuOptions: FC<MemberMenuOptionsProps> = ({ id, handleReload }) => {
  const handleDelete = () => {
    if (id) {
      deleteUser(id);
      setTimeout(() => {
        handleReload();
      }, 500);
    } else {
      toast.error('User ID not provided');
    }
  };

  return (
    <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
      <MenuItem>
        <MenuLink path="#">
          <MenuIcon>
            <KeenIcon icon="setting-3" />
          </MenuIcon>
          <MenuTitle>Edit User</MenuTitle>
        </MenuLink>
      </MenuItem>
      <MenuSeparator />
      <MenuItem onClick={handleDelete}>
        <MenuLink>
          <MenuIcon>
            <KeenIcon icon="trash" />
          </MenuIcon>
          <MenuTitle>Delete</MenuTitle>
        </MenuLink>
      </MenuItem>
    </MenuSub>
  );
};

export { MemberMenuOptions };

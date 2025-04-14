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
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManageUserSettings = has('manage users') || currentUser?.roles[0].name === 'superadmin';
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
        <MenuLink path={`/crm/member/profile/${id}`}>
          <MenuIcon>
            <KeenIcon icon="user" />
          </MenuIcon>
          <MenuTitle>View Profile</MenuTitle>
        </MenuLink>
      </MenuItem>
      {canManageUserSettings && (
        <>
          <MenuItem>
            <MenuLink path={`/crm/member-role-update/${id}`}>
              <MenuIcon>
                <KeenIcon icon="briefcase" />
              </MenuIcon>
              <MenuTitle>Edit Member Role</MenuTitle>
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink path={`/crm/member-update/${id}`}>
              <MenuIcon>
                <KeenIcon icon="user-edit" />
              </MenuIcon>
              <MenuTitle>Edit Member</MenuTitle>
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

export { MemberMenuOptions };

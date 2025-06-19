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
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';

interface MenuOptionsProps {
  id?: number;
  onDeleteClick: (id: number) => void;
}

export const PackagesMenuOptions: FC<MenuOptionsProps> = ({ id, onDeleteClick }) => {
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManage = has('manage orders') || currentUser?.roles[0].name === 'superadmin';

  return (
    <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
      {canManage && (
        <>
          <MenuItem>
            <MenuLink path={`/warehouse/packages/upload/${id}`}>
              <MenuIcon>
                <KeenIcon icon="file-up" />
              </MenuIcon>
              <MenuTitle>Upload file</MenuTitle>
            </MenuLink>
          </MenuItem>
          <MenuSeparator />
          <MenuItem>
            <MenuLink path={`/warehouse/packages/starter/${id}`}>
              <MenuIcon>
                <KeenIcon icon="pencil" />
              </MenuIcon>
              <MenuTitle>Edit</MenuTitle>
            </MenuLink>
          </MenuItem>
          <MenuSeparator />
          <MenuItem onClick={() => id && onDeleteClick(id)}>
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

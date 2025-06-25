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
import { useIntl } from 'react-intl';

interface MenuOptionsProps {
  id?: number;
  onDeleteClick: (id: number) => void;
}

export const CargoMenuOptions: FC<MenuOptionsProps> = ({ id, onDeleteClick }) => {
  const { formatMessage } = useIntl();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManage = has('manage orders') || currentUser?.roles[0].name === 'superadmin';

  return (
    <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
      {canManage && (
        <>
          <MenuItem>
            <MenuLink path={`/warehouse/cargo/upload/${id}`}>
              <MenuIcon>
                <KeenIcon icon="file-up" />
              </MenuIcon>
              <MenuTitle>{formatMessage({ id: 'SYSTEM.UPLOAD_FILE' })}</MenuTitle>
            </MenuLink>
          </MenuItem>
          <MenuSeparator />
          <MenuItem>
            <MenuLink path={`/warehouse/cargo/starter/${id}`}>
              <MenuIcon>
                <KeenIcon icon="pencil" />
              </MenuIcon>
              <MenuTitle>{formatMessage({ id: 'SYSTEM.EDIT' })}</MenuTitle>
            </MenuLink>
          </MenuItem>
          <MenuSeparator />
          <MenuItem onClick={() => id && onDeleteClick(id)}>
            <MenuLink>
              <MenuIcon>
                <KeenIcon icon="trash" className="text-danger !text-red-500" />
              </MenuIcon>
              <MenuTitle className="text-danger !text-red-500">
                {formatMessage({ id: 'SYSTEM.DELETE' })}
              </MenuTitle>
            </MenuLink>
          </MenuItem>
        </>
      )}
    </MenuSub>
  );
};

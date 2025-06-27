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

const TasksMenuOptions: FC<MenuOptionsProps> = ({ id, onDeleteClick }) => {
  const { formatMessage } = useIntl();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();

  const canManageGlobalSettings =
    has('manage tasks') || currentUser?.roles[0].name === 'superadmin';

  return (
    <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
      <MenuItem>
        <MenuLink path={`/tasks/view/${id}`}>
          <MenuIcon>
            <KeenIcon icon="more-2" />
          </MenuIcon>
          <MenuTitle>{formatMessage({ id: 'SYSTEM.VIEW' })}</MenuTitle>
        </MenuLink>
      </MenuItem>
      {canManageGlobalSettings && (
        <>
          <MenuItem>
            <MenuLink path={`/tasks/starter/${id}`}>
              <MenuIcon>
                <KeenIcon icon="setting-4" />
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

export { TasksMenuOptions };

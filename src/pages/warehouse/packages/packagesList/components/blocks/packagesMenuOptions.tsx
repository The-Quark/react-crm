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
import { useIntl } from 'react-intl';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postPackageAssignUser } from '@/api';

interface MenuOptionsProps {
  id?: number;
  onDeleteClick: (id: number) => void;
}

export const PackagesMenuOptions: FC<MenuOptionsProps> = ({ id, onDeleteClick }) => {
  const { currentUser } = useAuthContext();
  const { formatMessage } = useIntl();
  const { has } = useUserPermissions();
  const canManage = has('manage orders') || currentUser?.roles[0].name === 'superadmin';
  const queryClient = useQueryClient();

  const assignMutation = useMutation({
    mutationFn: postPackageAssignUser
  });

  const handleAssignToMe = () => {
    if (id && currentUser?.id) {
      assignMutation.mutate({
        id: id
      });
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    }
  };

  return (
    <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
      {canManage && (
        <>
          <MenuItem>
            <MenuLink path={`/warehouse/packages/upload/${id}`}>
              <MenuIcon>
                <KeenIcon icon="file-up" />
              </MenuIcon>
              <MenuTitle>{formatMessage({ id: 'SYSTEM.UPLOAD_FILE' })}</MenuTitle>
            </MenuLink>
          </MenuItem>
          <MenuSeparator />
          <MenuItem onClick={handleAssignToMe} disabled={assignMutation.isPending}>
            <MenuLink>
              <MenuIcon>
                <KeenIcon icon="user-tick" />
              </MenuIcon>
              <MenuTitle>
                {assignMutation.isPending
                  ? formatMessage({ id: 'SYSTEM.ASSIGNING' })
                  : formatMessage({ id: 'SYSTEM.ASSIGN_TO_ME' })}
              </MenuTitle>
            </MenuLink>
          </MenuItem>
          <MenuSeparator />
          <MenuItem>
            <MenuLink path={`/warehouse/packages/starter/${id}`}>
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

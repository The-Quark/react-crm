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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { putTask } from '@/api';
import { ITaskFormValues } from '@/api/post/postTask/types';

interface MenuOptionsProps {
  id?: number;
  onDeleteClick: (id: number) => void;
  assignUserId?: number;
}

const TasksMenuOptions: FC<MenuOptionsProps> = ({ id, onDeleteClick, assignUserId }) => {
  const { formatMessage } = useIntl();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const queryClient = useQueryClient();

  const canManageGlobalSettings =
    has('manage tasks') || currentUser?.roles[0].name === 'superadmin';

  const assignMutation = useMutation({
    mutationFn: (data: ITaskFormValues) => {
      if (!id) throw new Error('Task ID is required');
      return putTask(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const handleAssignToMe = () => {
    if (id && currentUser?.id) {
      assignMutation.mutate({ assigned_to: currentUser.id } as ITaskFormValues);
    }
  };

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
          {!assignUserId && (
            <>
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
            </>
          )}
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

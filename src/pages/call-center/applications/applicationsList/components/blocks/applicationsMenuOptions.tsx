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
import { deleteApplication } from '@/api';
import { useQueryClient } from '@tanstack/react-query';

interface MenuOptionsProps {
  id?: number;
}

const ApplicationsMenuOptions: FC<MenuOptionsProps> = ({ id }) => {
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManage = has('manage applications') || currentUser?.roles[0].name === 'superadmin';
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!id) {
      toast.error('ID not provided');
      return;
    }
    try {
      await deleteApplication(id);
      await queryClient.invalidateQueries({ queryKey: ['applications'] });
    } catch (error) {
      /* empty */
    }
  };

  return (
    <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
      {canManage && (
        <>
          <MenuItem>
            <MenuLink path={`/call-center/applications/starter/${id}`}>
              <MenuIcon>
                <KeenIcon icon="pencil" />
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

export { ApplicationsMenuOptions };

import {
  KeenIcon,
  MenuIcon,
  MenuItem,
  MenuLink,
  MenuSeparator,
  MenuSub,
  MenuTitle
} from '@/components';
import { FC, useState } from 'react';
import { toast } from 'sonner';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { deleteClient } from '@/api';
import { useQueryClient } from '@tanstack/react-query';
import { SharedDeleteModal } from '@/partials/sharedUI';

interface ParameterMenuOptionsProps {
  id?: number;
}

const ClientsListMenuOptions: FC<ParameterMenuOptionsProps> = ({ id }) => {
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManage = has('manage clients') || currentUser?.roles[0].name === 'superadmin';
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = () => {
    if (!id) {
      toast.error('Client ID not provided');
      return;
    }
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!id) return;

    setIsDeleting(true);
    try {
      await deleteClient(id);
      await queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client deleted successfully');
    } catch (error) {
      toast.error('Failed to delete client');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
        {canManage && (
          <>
            <MenuItem>
              <MenuLink path={`/clients/starter-clients/${id}`}>
                <MenuIcon>
                  <KeenIcon icon="user-edit" />
                </MenuIcon>
                <MenuTitle>Edit</MenuTitle>
              </MenuLink>
            </MenuItem>
            <MenuSeparator />
            <MenuItem onClick={handleDeleteClick}>
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
      <SharedDeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Client"
        description="Are you sure you want to delete this client? This action cannot be undone."
        isLoading={isDeleting}
      />
    </>
  );
};

export { ClientsListMenuOptions };

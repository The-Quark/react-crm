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
import { deleteTemplate } from '@/api';
import { useQueryClient } from '@tanstack/react-query';
import { TemplatesModal } from '@/pages/guides/tabs/templates/components/blocks/templatesModal.tsx';
import { TemplatesUploadModal } from '@/pages/guides/tabs/templates/components/blocks/templatesUploadModal.tsx';

interface MenuOptionsProps {
  id?: number;
  selectedLanguage: string;
}

export const TemplatesMenuOptions: FC<MenuOptionsProps> = ({ id, selectedLanguage }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUploadOpen, setModalUploadOpen] = useState(false);
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManageSettings =
    has('manage global settings') || currentUser?.roles[0].name === 'superadmin';
  const queryClient = useQueryClient();

  const handleUploadClose = () => {
    setModalUploadOpen(false);
  };
  const handleUploadOpen = () => {
    setModalUploadOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };
  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!id) {
      toast.error('ID not provided');
      return;
    }
    try {
      await deleteTemplate(id);
      await queryClient.invalidateQueries({ queryKey: ['guidesTemplates'] });
      toast.success('Template deleted');
    } catch {
      toast.error('Failed to delete template');
    }
  };

  return (
    <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
      {canManageSettings && (
        <>
          <MenuItem onClick={handleUploadOpen}>
            <MenuLink>
              <MenuIcon>
                <KeenIcon icon="file-up" />
              </MenuIcon>
              <MenuTitle>Upload file</MenuTitle>
            </MenuLink>
          </MenuItem>
          <MenuSeparator />
          <MenuItem onClick={handleOpen}>
            <MenuLink>
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
      {modalOpen && (
        <TemplatesModal
          id={id}
          open={modalOpen}
          onOpenChange={handleClose}
          selectedLanguage={selectedLanguage}
        />
      )}
      {modalUploadOpen && (
        <TemplatesUploadModal
          id={id}
          open={modalUploadOpen}
          onOpenChange={handleUploadClose}
          selectedLanguage={selectedLanguage}
        />
      )}
    </MenuSub>
  );
};

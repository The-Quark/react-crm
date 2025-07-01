import {
  KeenIcon,
  MenuIcon,
  MenuItem,
  MenuLink,
  MenuSeparator,
  MenuSub,
  MenuTitle,
  MenuToggle,
  Menu
} from '@/components';
import React, { FC, useState } from 'react';
import { toast } from 'sonner';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { deleteTemplate } from '@/api';
import { useQueryClient } from '@tanstack/react-query';
import { TemplatesModal } from '@/pages/guides/tabs/templates/components/blocks/templatesModal.tsx';
import { TemplatesUploadModal } from '@/pages/guides/tabs/templates/components/blocks/templatesUploadModal.tsx';
import { useLanguage } from '@/providers';
import { useIntl } from 'react-intl';

interface MenuOptionsProps {
  id?: number;
  selectedLanguage: string;
}

export const TemplatesMenuOptions: FC<MenuOptionsProps> = ({ id, selectedLanguage }) => {
  const [activeModal, setActiveModal] = useState<'edit' | 'upload' | null>(null);
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManageSettings =
    has('manage global settings') || currentUser?.roles[0].name === 'superadmin';
  const queryClient = useQueryClient();
  const { isRTL } = useLanguage();
  const { formatMessage } = useIntl();

  const handleUploadOpen = () => {
    setActiveModal('upload');
  };

  const handleEditOpen = () => {
    setActiveModal('edit');
  };

  const handleClose = () => {
    setActiveModal(null);
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
    <Menu className="items-stretch">
      <MenuItem
        toggle="dropdown"
        trigger="click"
        dropdownProps={{
          placement: isRTL() ? 'bottom-start' : 'bottom-end',
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: isRTL() ? [0, -10] : [0, 10]
              }
            }
          ]
        }}
      >
        <MenuToggle className="btn btn-sm btn-icon btn-light btn-clear">
          <KeenIcon icon="dots-vertical" />
        </MenuToggle>
        {!activeModal && (
          <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
            {canManageSettings && (
              <>
                <MenuItem onClick={handleUploadOpen}>
                  <MenuLink>
                    <MenuIcon>
                      <KeenIcon icon="file-up" />
                    </MenuIcon>
                    <MenuTitle>{formatMessage({ id: 'SYSTEM.UPLOAD_FILE' })}</MenuTitle>
                  </MenuLink>
                </MenuItem>
                <MenuSeparator />
                <MenuItem onClick={handleEditOpen}>
                  <MenuLink>
                    <MenuIcon>
                      <KeenIcon icon="pencil" />
                    </MenuIcon>
                    <MenuTitle>{formatMessage({ id: 'SYSTEM.EDIT' })}</MenuTitle>
                  </MenuLink>
                </MenuItem>
                <MenuSeparator />
                <MenuItem onClick={handleDelete}>
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
        )}
        {activeModal === 'edit' && (
          <TemplatesModal
            id={id}
            open={true}
            onOpenChange={handleClose}
            selectedLanguage={selectedLanguage}
          />
        )}
        {activeModal === 'upload' && (
          <TemplatesUploadModal
            id={id}
            open={true}
            onOpenChange={handleClose}
            selectedLanguage={selectedLanguage}
          />
        )}
      </MenuItem>
    </Menu>
  );
};

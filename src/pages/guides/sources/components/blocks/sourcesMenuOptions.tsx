import {
  KeenIcon,
  Menu,
  MenuIcon,
  MenuItem,
  MenuLink,
  MenuSeparator,
  MenuSub,
  MenuTitle,
  MenuToggle
} from '@/components';
import React, { FC, useState } from 'react';
import { toast } from 'sonner';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { useLanguage } from '@/providers';
import { deleteSource } from '@/api';
import SourceModal from '@/pages/guides/sources/components/blocks/sourcesModal.tsx';

interface ParameterMenuOptionsProps {
  id?: number;
  handleReload: () => void;
}

const SourceMenuOptions: FC<ParameterMenuOptionsProps> = ({ id, handleReload }) => {
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManageSourceSettings =
    has('manage global settings') || currentUser?.roles[0].name === 'superadmin';
  const [sourceModalOpen, setSourceModalOpen] = useState(false);
  const { isRTL } = useLanguage();

  const handleClose = () => {
    setSourceModalOpen(false);
  };
  const handleOpen = () => {
    setSourceModalOpen(true);
  };

  const handleDelete = () => {
    if (id) {
      deleteSource(id);
      setTimeout(() => {
        handleReload();
      }, 500);
    } else {
      toast.error('Source ID not provided');
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
        {!sourceModalOpen && (
          <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
            {canManageSourceSettings && (
              <>
                <MenuItem onClick={handleOpen}>
                  <MenuLink>
                    <MenuIcon>
                      <KeenIcon icon="setting-4" />
                    </MenuIcon>
                    <MenuTitle>Edit Source</MenuTitle>
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
        )}
      </MenuItem>
      {sourceModalOpen && (
        <SourceModal
          open={sourceModalOpen}
          onOpenChange={handleClose}
          setReload={handleReload}
          id={id}
        />
      )}
    </Menu>
  );
};

export { SourceMenuOptions };

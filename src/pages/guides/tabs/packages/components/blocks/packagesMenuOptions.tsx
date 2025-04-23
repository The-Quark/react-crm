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
import { deleteLanguage } from '@/api';
import PackagesModal from '@/pages/guides/tabs/packages/components/blocks/packagesModal.tsx';

interface ParameterMenuOptionsProps {
  id?: number;
  handleReload: () => void;
}

const PackagesMenuOptions: FC<ParameterMenuOptionsProps> = ({ id, handleReload }) => {
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManagePackageSettings =
    has('manage global settings') || currentUser?.roles[0].name === 'superadmin';
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const { isRTL } = useLanguage();

  const handleClose = () => {
    setPackageModalOpen(false);
  };
  const handleOpen = () => {
    setPackageModalOpen(true);
  };

  const handleDelete = () => {
    if (id) {
      deleteLanguage(id);
      setTimeout(() => {
        handleReload();
      }, 500);
    } else {
      toast.error('Language ID not provided');
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
        {!packageModalOpen && (
          <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
            {canManagePackageSettings && (
              <>
                <MenuItem onClick={handleOpen}>
                  <MenuLink>
                    <MenuIcon>
                      <KeenIcon icon="setting-4" />
                    </MenuIcon>
                    <MenuTitle>Edit Package</MenuTitle>
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
      {packageModalOpen && (
        <PackagesModal
          open={packageModalOpen}
          onOpenChange={handleClose}
          setReload={handleReload}
          id={id}
        />
      )}
    </Menu>
  );
};

export { PackagesMenuOptions };

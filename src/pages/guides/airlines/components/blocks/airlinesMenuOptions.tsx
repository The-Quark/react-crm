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
import CurrenciesModal from '@/pages/guides/currencies/components/blocks/currenciesModal.tsx';
import { deleteAirline } from '@/api';

interface ParameterMenuOptionsProps {
  id?: number;
  handleReload: () => void;
}

const AirlinesMenuOptions: FC<ParameterMenuOptionsProps> = ({ id, handleReload }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManageSettings =
    has('manage global settings') || currentUser?.roles[0].name === 'superadmin';
  const { isRTL } = useLanguage();

  const handleClose = () => {
    setModalOpen(false);
  };
  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleDelete = () => {
    if (id) {
      deleteAirline(id);
      setTimeout(() => {
        handleReload();
      }, 500);
    } else {
      toast.error('ID not provided');
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
        {!modalOpen && (
          <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
            {canManageSettings && (
              <>
                <MenuItem onClick={handleOpen}>
                  <MenuLink>
                    <MenuIcon>
                      <KeenIcon icon="setting-4" />
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
        )}
      </MenuItem>
      {modalOpen && (
        <CurrenciesModal
          open={modalOpen}
          onOpenChange={handleClose}
          setReload={handleReload}
          id={id}
        />
      )}
    </Menu>
  );
};

export { AirlinesMenuOptions };

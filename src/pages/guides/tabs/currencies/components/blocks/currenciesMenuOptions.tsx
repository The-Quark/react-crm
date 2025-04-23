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
import CurrenciesModal from '@/pages/guides/tabs/currencies/components/blocks/currenciesModal.tsx';
import { deleteCurrency } from '@/api';

interface ParameterMenuOptionsProps {
  id?: number;
  handleReload: () => void;
}

const CurrenciesMenuOptions: FC<ParameterMenuOptionsProps> = ({ id, handleReload }) => {
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManageCurrenciesSettings =
    has('manage global settings') || currentUser?.roles[0].name === 'superadmin';
  const [currrencyModalOpen, setCurrencyModalOpen] = useState(false);
  const { isRTL } = useLanguage();

  const handleClose = () => {
    setCurrencyModalOpen(false);
  };
  const handleOpen = () => {
    setCurrencyModalOpen(true);
  };

  const handleDelete = () => {
    if (id) {
      deleteCurrency(id);
      setTimeout(() => {
        handleReload();
      }, 500);
    } else {
      toast.error('Currency ID not provided');
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
        {!currrencyModalOpen && (
          <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
            {canManageCurrenciesSettings && (
              <>
                <MenuItem onClick={handleOpen}>
                  <MenuLink>
                    <MenuIcon>
                      <KeenIcon icon="setting-4" />
                    </MenuIcon>
                    <MenuTitle>Edit Currency</MenuTitle>
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
      {currrencyModalOpen && (
        <CurrenciesModal
          open={currrencyModalOpen}
          onOpenChange={handleClose}
          setReload={handleReload}
          id={id}
        />
      )}
    </Menu>
  );
};

export { CurrenciesMenuOptions };

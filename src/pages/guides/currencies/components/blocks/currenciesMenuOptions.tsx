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
import axios from 'axios';
import { toast } from 'sonner';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import LanguagesModal from '@/pages/guides/languages/components/blocks/languagesModal.tsx';
import { useLanguage } from '@/providers';

interface ParameterMenuOptionsProps {
  id?: number;
  handleReload: () => void;
}

const API_URL = import.meta.env.VITE_APP_API_URL;
const CURRENCY_DELETE_URL = `${API_URL}/currency/manage`;

const deleteCurrency = async (id: number) => {
  try {
    await axios.delete(`${CURRENCY_DELETE_URL}/?id=${id}`);
  } catch (error) {
    console.error('Error deleting currency:', error);
  }
};

const CurrenciesMenuOptions: FC<ParameterMenuOptionsProps> = ({ id, handleReload }) => {
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManageCurrenciesSettings =
    has('manage global settings') || currentUser?.roles[0].name === 'superadmin';
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const { isRTL } = useLanguage();

  const handleClose = () => {
    setLanguageModalOpen(false);
  };
  const handleOpen = () => {
    setLanguageModalOpen(true);
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
        {!languageModalOpen && (
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
      {languageModalOpen && (
        <LanguagesModal
          open={languageModalOpen}
          onOpenChange={handleClose}
          setReload={handleReload}
          id={id}
        />
      )}
    </Menu>
  );
};

export { CurrenciesMenuOptions };

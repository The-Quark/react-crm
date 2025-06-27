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
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { useLanguage } from '@/providers';
import { SubdivisionModal } from '@/pages/global-parameters/subdivisions/subdivisions-list/components/blocks/subdivisionsModal.tsx';
import { useIntl } from 'react-intl';

interface MenuOptionsProps {
  id?: number;
  onDeleteClick: (id: number) => void;
}

export const SubdivisionsMenuOptions: FC<MenuOptionsProps> = ({ id, onDeleteClick }) => {
  const [activeModal, setActiveModal] = useState<boolean>(false);
  const { currentUser } = useAuthContext();
  const { formatMessage } = useIntl();
  const { has } = useUserPermissions();
  const { isRTL } = useLanguage();

  const canManageSettings =
    has('manage global settings') || currentUser?.roles[0].name === 'superadmin';

  const handleOpen = () => {
    setActiveModal(true);
  };

  const handleClose = () => {
    setActiveModal(false);
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
                <MenuItem onClick={handleOpen}>
                  <MenuLink>
                    <MenuIcon>
                      <KeenIcon icon="pencil" />
                    </MenuIcon>
                    <MenuTitle>{formatMessage({ id: 'SYSTEM.EDIT' })}</MenuTitle>
                  </MenuLink>
                </MenuItem>
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
        )}
        {activeModal && <SubdivisionModal open={activeModal} onOpenChange={handleClose} id={id} />}
      </MenuItem>
    </Menu>
  );
};

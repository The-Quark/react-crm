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
import { deleteGlobalParamsPosition } from '@/api';
import { useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/providers';
import { PositionsModal } from '@/pages/global-parameters/positions/positions-list/components/blocks/positionsModal.tsx';

interface MenuOptionsProps {
  id?: number;
}

export const PositionsMenuOptions: FC<MenuOptionsProps> = ({ id }) => {
  const [activeModal, setActiveModal] = useState<boolean>(false);
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();
  const canManageSettings =
    has('manage global settings') || currentUser?.roles[0].name === 'superadmin';
  const queryClient = useQueryClient();
  const { isRTL } = useLanguage();

  const handleOpen = () => {
    setActiveModal(true);
  };

  const handleClose = () => {
    setActiveModal(false);
  };

  const handleDelete = async () => {
    if (!id) {
      toast.error('ID not provided');
      return;
    }
    try {
      await deleteGlobalParamsPosition(id);
      await queryClient.invalidateQueries({ queryKey: ['globalParamsPositions'] });
      toast.success('Position deleted');
    } catch {
      toast.error('Failed to delete position');
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
          </MenuSub>
        )}
        {activeModal && <PositionsModal open={activeModal} onOpenChange={handleClose} id={id} />}
      </MenuItem>
    </Menu>
  );
};

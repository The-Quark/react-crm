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
import { useLanguage } from '@/providers';
import { useQueryClient } from '@tanstack/react-query';
import { useIntl } from 'react-intl';

interface IMenuOptionsProps {
  id?: number;
  deleteRequest: (id: number) => Promise<void>;
  invalidateRequestKey: string;
  renderModal: (props: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    id?: number;
  }) => React.ReactNode;
}

const GuidesMenuOptions: FC<IMenuOptionsProps> = ({
  id,
  deleteRequest,
  renderModal,
  invalidateRequestKey
}) => {
  const { isRTL } = useLanguage();
  const queryClient = useQueryClient();
  const { formatMessage } = useIntl();
  const [modalOpen, setModalOpen] = useState(false);

  const handleClose = () => {
    setModalOpen(false);
  };
  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (id) {
      try {
        await deleteRequest(id);
        queryClient.invalidateQueries({ queryKey: [invalidateRequestKey] });
      } catch (error) {
        toast.error('Failed to delete');
      }
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
            <>
              <MenuItem onClick={handleOpen}>
                <MenuLink>
                  <MenuIcon>
                    <KeenIcon icon="setting-4" />
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
          </MenuSub>
        )}
      </MenuItem>
      {modalOpen &&
        renderModal({
          open: modalOpen,
          onOpenChange: handleClose,
          id
        })}
    </Menu>
  );
};

export { GuidesMenuOptions };

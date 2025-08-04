import {
  KeenIcon,
  MenuIcon,
  MenuItem,
  MenuLink,
  MenuSeparator,
  MenuSub,
  MenuTitle
} from '@/components';
import { FC } from 'react';
import { useAuthContext } from '@/auth';
import { useUserPermissions } from '@/hooks';
import { useIntl } from 'react-intl';
import { CLIENT_MIN_INVOICE_RATING } from '@/utils';

interface MenuOptionsProps {
  id?: number;
  onDeleteClick: (id: number) => void;
  clientRating?: number | null;
}

export const OrdersMenuOptions: FC<MenuOptionsProps> = ({ id, onDeleteClick, clientRating }) => {
  const { formatMessage } = useIntl();
  const { currentUser } = useAuthContext();
  const { has } = useUserPermissions();

  const canManage = has('manage orders') || currentUser?.roles[0].name === 'superadmin';
  const canCreateInvoice = (clientRating ?? 0) >= CLIENT_MIN_INVOICE_RATING;

  return (
    <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
      {canManage && (
        <>
          <MenuItem>
            <MenuLink path={`/call-center/orders/starter/${id}`}>
              <MenuIcon>
                <KeenIcon icon="pencil" />
              </MenuIcon>
              <MenuTitle>{formatMessage({ id: 'SYSTEM.EDIT' })}</MenuTitle>
            </MenuLink>
          </MenuItem>
          <MenuSeparator />
          {canCreateInvoice && (
            <>
              <MenuItem>
                <MenuLink>
                  <MenuIcon>
                    <KeenIcon icon="tag" />
                  </MenuIcon>
                  <MenuTitle>{formatMessage({ id: 'SYSTEM.CREATE_INVOICE' })}</MenuTitle>
                </MenuLink>
              </MenuItem>
              <MenuSeparator />
            </>
          )}
          <MenuItem>
            <MenuLink path={`/audit-changes/order/${id}`}>
              <MenuIcon>
                <KeenIcon icon="archive" />
              </MenuIcon>
              <MenuTitle>{formatMessage({ id: 'SYSTEM.CHECK_HISTORY' })}</MenuTitle>
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
  );
};

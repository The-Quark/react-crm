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
import { useIntl } from 'react-intl';

interface MenuOptionsProps {
  id?: number;
  onDeleteClick: (id: number) => void;
}

const ParameterMenuOptions: FC<MenuOptionsProps> = ({ id, onDeleteClick }) => {
  const { formatMessage } = useIntl();

  return (
    <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
      <MenuItem>
        <MenuLink path={`/global-parameters/view-parameters/${id}`}>
          <MenuIcon>
            <KeenIcon icon="more-2" />
          </MenuIcon>
          <MenuTitle>{formatMessage({ id: 'SYSTEM.VIEW' })}</MenuTitle>
        </MenuLink>
      </MenuItem>
      <MenuItem>
        <MenuLink path={`/global-parameters/starter-parameters/${id}`}>
          <MenuIcon>
            <KeenIcon icon="setting-4" />
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
    </MenuSub>
  );
};

export { ParameterMenuOptions };

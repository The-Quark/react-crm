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

interface ParameterMenuOptionsProps {
  id?: number;
  onDeleteClick: (id: number) => void;
}

const ClientsListMenuOptions: FC<ParameterMenuOptionsProps> = ({ id, onDeleteClick }) => {
  return (
    <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
      <MenuItem>
        <MenuLink path={`/clients/starter-clients/${id}`}>
          <MenuIcon>
            <KeenIcon icon="user-edit" />
          </MenuIcon>
          <MenuTitle>Edit</MenuTitle>
        </MenuLink>
      </MenuItem>
      <MenuSeparator />
      <MenuItem onClick={() => id && onDeleteClick(id)}>
        <MenuLink>
          <MenuIcon>
            <KeenIcon icon="trash" className="text-danger !text-red-500" />
          </MenuIcon>
          <MenuTitle className="text-danger !text-red-500">Delete</MenuTitle>
        </MenuLink>
      </MenuItem>
    </MenuSub>
  );
};

export { ClientsListMenuOptions };

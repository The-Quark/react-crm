import { ChangeEvent, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { useAuthContext } from '@/auth';
import { toAbsoluteUrl } from '@/utils';
import { DropdownUserLanguages } from './DropdownUserLanguages';
import { useSettings } from '@/providers/SettingsProvider';
import { KeenIcon } from '@/components';
import { MenuItem, MenuLink, MenuSub, MenuTitle, MenuSeparator, MenuIcon } from '@/components/menu';
import { DropdownUserCurrency } from '@/partials/dropdowns/user/DropdownUserCurrency.tsx';
import { useCurrentUser } from '@/api/get';

interface IDropdownUserProps {
  menuItemRef: any;
}
const STORAGE_URL = import.meta.env.VITE_APP_STORAGE_AVATAR_URL;

const DropdownUser = ({ menuItemRef }: IDropdownUserProps) => {
  const { data: currentUser } = useCurrentUser();
  const { settings, storeSettings } = useSettings();
  const { logout } = useAuthContext();

  const handleThemeMode = (event: ChangeEvent<HTMLInputElement>) => {
    const newThemeMode = event.target.checked ? 'dark' : 'light';

    storeSettings({
      themeMode: newThemeMode
    });
  };

  const buildHeader = () => {
    return (
      <div className="flex items-center justify-between px-5 py-1.5 gap-1.5">
        <div className="flex items-center gap-2">
          <img
            className="size-9 rounded-full border-2 border-success"
            src={
              currentUser?.avatar
                ? `${STORAGE_URL}/${currentUser.avatar}`
                : toAbsoluteUrl('/media/avatars/blank.png')
            }
            alt="avatar"
          />
          <div className="flex flex-col gap-1.5">
            <Link
              to={`/profile`}
              className="text-sm text-gray-800 hover:text-primary font-semibold leading-none"
            >
              {currentUser
                ? `${currentUser.last_name} ${currentUser.first_name} ${currentUser.patronymic}`
                : 'Not Found'}
            </Link>
            <a
              href="#"
              className="text-xs text-gray-600 hover:text-primary font-medium leading-none"
            >
              {currentUser ? currentUser.email : 'Not Found'}
            </a>
          </div>
        </div>
        <span className="badge badge-xs badge-primary badge-outline">
          {currentUser
            ? currentUser.roles?.[0]?.nicename
              ? currentUser.roles[0].nicename
              : `${currentUser.roles[0].name[0].toUpperCase()}${currentUser.roles[0].name.slice(1)}`
            : 'Not Found'}
        </span>
      </div>
    );
  };

  const buildMenu = () => {
    return (
      <Fragment>
        <MenuSeparator />
        <div className="flex flex-col">
          <MenuItem>
            <MenuLink path={`/crm/users/public-profile/${currentUser?.id}`}>
              <MenuIcon className="menu-icon">
                <KeenIcon icon="badge" />
              </MenuIcon>
              <MenuTitle>
                <FormattedMessage id="USER.MENU.PUBLIC_PROFILE" />
              </MenuTitle>
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink path="/profile">
              <MenuIcon>
                <KeenIcon icon="profile-circle" />
              </MenuIcon>
              <MenuTitle>
                <FormattedMessage id="USER.MENU.MY_PROFILE" />
              </MenuTitle>
            </MenuLink>
          </MenuItem>
          <DropdownUserCurrency menuItemRef={menuItemRef} />
          <DropdownUserLanguages menuItemRef={menuItemRef} />
          <MenuSeparator />
        </div>
      </Fragment>
    );
  };

  const buildFooter = () => {
    return (
      <div className="flex flex-col">
        <div className="menu-item mb-0.5">
          <div className="menu-link">
            <span className="menu-icon">
              <KeenIcon icon="moon" />
            </span>
            <span className="menu-title">
              <FormattedMessage id="USER.MENU.DARK_MODE" />
            </span>
            <label className="switch switch-sm">
              <input
                name="theme"
                type="checkbox"
                checked={settings.themeMode === 'dark'}
                onChange={handleThemeMode}
                value="1"
              />
            </label>
          </div>
        </div>

        <div className="menu-item px-4 py-1.5">
          <a onClick={logout} className="btn btn-sm btn-light justify-center">
            <FormattedMessage id="USER.MENU.LOGOUT" />
          </a>
        </div>
      </div>
    );
  };

  return (
    <MenuSub
      className="menu-default light:border-gray-300 w-[250px] md:w-[300px]"
      rootClassName="p-0"
    >
      {buildHeader()}
      {buildMenu()}
      {buildFooter()}
    </MenuSub>
  );
};

export { DropdownUser };

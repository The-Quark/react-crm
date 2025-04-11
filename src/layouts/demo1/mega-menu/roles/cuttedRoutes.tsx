import { MenuItem, MenuLink, MenuTitle, TMenuConfig } from '@/components';
import { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';

export const CuttedRoutesBuild = (items: TMenuConfig) => {
  const homeItem = items[0];
  const profileItem = items[1];
  const globalItem = items[2];

  const linkClass =
    'menu-link text-sm text-gray-700 font-medium menu-link-hover:text-primary menu-item-active:text-gray-900 menu-item-show:text-primary menu-item-here:text-gray-900';
  const titleClass = 'text-nowrap';

  return (
    <Fragment>
      <MenuItem key="home">
        <MenuLink path={homeItem.path} className={linkClass}>
          <MenuTitle className={titleClass}>
            <FormattedMessage id={homeItem.title} />
          </MenuTitle>
        </MenuLink>
      </MenuItem>

      <MenuItem key="profile">
        <MenuLink path={profileItem.path} className={linkClass}>
          <MenuTitle className={titleClass}>
            <FormattedMessage id={profileItem.title} />
          </MenuTitle>
        </MenuLink>
      </MenuItem>

      <MenuItem key="global parameters">
        <MenuLink path={globalItem.path} className={linkClass}>
          <MenuTitle className={titleClass}>
            <FormattedMessage id={globalItem.title} />
          </MenuTitle>
        </MenuLink>
      </MenuItem>
    </Fragment>
  );
};

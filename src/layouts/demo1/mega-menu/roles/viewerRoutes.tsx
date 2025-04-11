import { KeenIcon, MenuArrow, MenuItem, MenuLink, MenuTitle, TMenuConfig } from '@/components';
import { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { MegaMenuSubWithSubSets } from '@/partials/menu/mega-menu';
import { useResponsive } from '@/hooks';
import { useLanguage } from '@/providers';

const buildArrow = () => {
  return (
    <MenuArrow className="flex lg:hidden text-gray-400">
      <KeenIcon icon="plus" className="text-2xs menu-item-show:hidden" />
      <KeenIcon icon="minus" className="text-2xs hidden menu-item-show:inline-flex" />
    </MenuArrow>
  );
};

export const ViewerRoutesBuild = (items: TMenuConfig) => {
  const desktopMode = useResponsive('up', 'lg');
  const { isRTL } = useLanguage();
  const homeItem = items[0];
  const profileItem = items[1];
  const globalItem = items[2];
  const clientsItem = items[3];
  const rolesPermissionsItem = items[4];
  const hrModuleItem = items[5];
  const callCenterItem = items[6];
  const crmItem = items[7];

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

      <MenuItem key="clients">
        <MenuLink path={clientsItem.path} className={linkClass}>
          <MenuTitle className={titleClass}>
            <FormattedMessage id={clientsItem.title} />
          </MenuTitle>
        </MenuLink>
      </MenuItem>

      <MenuItem
        key="roles-permissions"
        toggle={desktopMode ? 'dropdown' : 'accordion'}
        trigger={desktopMode ? 'hover' : 'click'}
        dropdownProps={{
          placement: isRTL() ? 'bottom-end' : 'bottom-start'
        }}
      >
        <MenuLink className={linkClass}>
          <MenuTitle className={titleClass}>
            <FormattedMessage id={rolesPermissionsItem.title} />
          </MenuTitle>
          {buildArrow()}
        </MenuLink>
        {MegaMenuSubWithSubSets(items, 4)}
      </MenuItem>

      <MenuItem
        key="hr module"
        toggle={desktopMode ? 'dropdown' : 'accordion'}
        trigger={desktopMode ? 'hover' : 'click'}
        dropdownProps={{
          placement: isRTL() ? 'bottom-end' : 'bottom-start'
        }}
      >
        <MenuLink className={linkClass}>
          <MenuTitle className={titleClass}>
            <FormattedMessage id={hrModuleItem.title} />
          </MenuTitle>
          {buildArrow()}
        </MenuLink>
        {MegaMenuSubWithSubSets(items, 5)}
      </MenuItem>

      <MenuItem
        key="call center"
        toggle={desktopMode ? 'dropdown' : 'accordion'}
        trigger={desktopMode ? 'hover' : 'click'}
        dropdownProps={{
          placement: isRTL() ? 'bottom-end' : 'bottom-start'
        }}
      >
        <MenuLink className={linkClass}>
          <MenuTitle className={titleClass}>
            <FormattedMessage id={callCenterItem.title} />
          </MenuTitle>
          {buildArrow()}
        </MenuLink>
        {MegaMenuSubWithSubSets(items, 6)}
      </MenuItem>

      <MenuItem
        key="crm"
        toggle={desktopMode ? 'dropdown' : 'accordion'}
        trigger={desktopMode ? 'hover' : 'click'}
        dropdownProps={{
          placement: isRTL() ? 'bottom-end' : 'bottom-start'
        }}
      >
        <MenuLink className={linkClass}>
          <MenuTitle className={titleClass}>
            <FormattedMessage id={crmItem.title} />
          </MenuTitle>
          {buildArrow()}
        </MenuLink>
        {MegaMenuSubWithSubSets(items, 7)}
      </MenuItem>
    </Fragment>
  );
};

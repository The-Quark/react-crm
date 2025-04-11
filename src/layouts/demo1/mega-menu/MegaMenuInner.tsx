import { Fragment, useEffect, useState } from 'react';
import { useResponsive } from '@/hooks';
import { KeenIcon } from '@/components';
import { TMenuConfig, MenuItem, MenuLink, MenuTitle, MenuArrow, Menu } from '@/components/menu';
import { MegaMenuSubWithSubSets } from '@/partials/menu/mega-menu';
import { useDemo1Layout } from '../Demo1LayoutProvider';
import { MENU_MEGA } from '@/config';
import { useLanguage } from '@/i18n';
import { FormattedMessage } from 'react-intl';
import { useCurrentUser } from '@/api';
import { CuttedMenuSideBar } from '@/config/blocks/menu/menuSideBar/roles/cuttedMenuSideBar.ts';
import { AllMenuMega } from '@/config/blocks/menu/menuMega/roles/allMenuMega.ts';
import { ViewerMenuMega } from '@/config/blocks/menu/menuMega/roles/viewerMenuMega.ts';

const MegaMenuInner = () => {
  const desktopMode = useResponsive('up', 'lg');
  const { isRTL } = useLanguage();
  const [disabled, setDisabled] = useState(true); // Initially set disabled to true
  const { layout, sidebarMouseLeave, setMegaMenuEnabled } = useDemo1Layout();
  const { data: currentUser } = useCurrentUser();
  const userRole: string | undefined = currentUser?.roles?.[0]?.name;

  const roleToMenu: Record<string, typeof MENU_MEGA> = {
    superadmin: AllMenuMega,
    viewer: ViewerMenuMega
  };

  const selectedMenu = userRole && roleToMenu[userRole] ? roleToMenu[userRole] : CuttedMenuSideBar;

  // Change disabled state to false after a certain time (e.g., 5 seconds)
  useEffect(() => {
    setDisabled(true);

    const timer = setTimeout(() => {
      setDisabled(false);
    }, 1000); // 1000 milliseconds

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [layout.options.sidebar.collapse, sidebarMouseLeave]);

  useEffect(() => {
    setMegaMenuEnabled(true);
  });

  const build = (items: TMenuConfig) => {
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

        <MenuItem
          key="global parameters"
          toggle={desktopMode ? 'dropdown' : 'accordion'}
          trigger={desktopMode ? 'hover' : 'click'}
          dropdownProps={{
            placement: isRTL() ? 'bottom-end' : 'bottom-start'
          }}
        >
          <MenuLink className={linkClass}>
            <MenuTitle className={titleClass}>
              <FormattedMessage id={globalItem.title} />
            </MenuTitle>
            {buildArrow()}
          </MenuLink>
          {MegaMenuSubWithSubSets(items, 2)}
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

  const buildArrow = () => {
    return (
      <MenuArrow className="flex lg:hidden text-gray-400">
        <KeenIcon icon="plus" className="text-2xs menu-item-show:hidden" />
        <KeenIcon icon="minus" className="text-2xs hidden menu-item-show:inline-flex" />
      </MenuArrow>
    );
  };

  return (
    <Menu
      multipleExpand={true}
      disabled={disabled}
      highlight={true}
      className="flex-col lg:flex-row gap-5 lg:gap-7.5 p-5 lg:p-0"
    >
      {build(selectedMenu)}
    </Menu>
  );
};

export { MegaMenuInner };

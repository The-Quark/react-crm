import { useEffect, useState } from 'react';
import { Menu } from '@/components/menu';
import { useDemo1Layout } from '../Demo1LayoutProvider';
import { MENU_MEGA } from '@/config';
import { useCurrentUser } from '@/api';
import { AllMenuMega } from '@/config/blocks/menu/menuMega/roles/allMenuMega.ts';
import { ViewerMenuMega } from '@/config/blocks/menu/menuMega/roles/viewerMenuMega.ts';
import { CuttedMenuMega } from '@/config/blocks/menu/menuMega/roles/cuttedMenuMega.ts';
import { AllRoutesBuild } from '@/layouts/demo1/mega-menu/roles/AllRoutes.tsx';
import { ViewerRoutesBuild } from '@/layouts/demo1/mega-menu/roles/viewerRoutes.tsx';
import { CuttedRoutesBuild } from '@/layouts/demo1/mega-menu/roles/cuttedRoutes.tsx';

const MegaMenuInner = () => {
  const [disabled, setDisabled] = useState(true); // Initially set disabled to true
  const { layout, sidebarMouseLeave, setMegaMenuEnabled } = useDemo1Layout();
  const { data: currentUser } = useCurrentUser();
  const userRole: string | undefined = currentUser?.roles?.[0]?.name;

  const roleToMenu: Record<string, typeof MENU_MEGA> = {
    superadmin: AllMenuMega,
    viewer: ViewerMenuMega
  };

  const selectedMenu = userRole && roleToMenu[userRole] ? roleToMenu[userRole] : CuttedMenuMega;

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

  return (
    <Menu
      multipleExpand={true}
      disabled={disabled}
      highlight={true}
      className="flex-col lg:flex-row gap-5 lg:gap-7.5 p-5 lg:p-0"
    >
      {userRole === 'superadmin' && AllRoutesBuild(selectedMenu)}
      {userRole === 'viewer' && ViewerRoutesBuild(selectedMenu)}
      {userRole !== 'viewer' && userRole !== 'superadmin' && CuttedRoutesBuild(selectedMenu)}
    </Menu>
  );
};

export { MegaMenuInner };

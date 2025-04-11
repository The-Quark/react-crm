import { MENU_SIDEBAR } from '@/config';
import { AllMenuSideBar } from '@/config/blocks/menu/menuSideBar/roles/allMenuSideBar.ts';
import { ViewerMenuSideBar } from '@/config/blocks/menu/menuSideBar/roles/viewerMenuSideBar.ts';
import { CuttedMenuSideBar } from '@/config/blocks/menu/menuSideBar/roles/cuttedMenuSideBar.ts';

export const controlAccessLogic = (role?: string): typeof MENU_SIDEBAR => {
  const roleToMenu: Record<string, typeof MENU_SIDEBAR> = {
    superadmin: AllMenuSideBar,
    viewer: ViewerMenuSideBar
  };
  if (role && roleToMenu[role]) {
    return roleToMenu[role];
  }
  return CuttedMenuSideBar;
};

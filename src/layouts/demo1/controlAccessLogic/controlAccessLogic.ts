import { MENU_SIDEBAR } from '@/config';
import { AllMenuSideBar } from '@/config/blocks/menu/menuSideBar/roles/allMenuSideBar.ts';
import { ViewerMenuSideBar } from '@/config/blocks/menu/menuSideBar/roles/viewerMenuSideBar.ts';
import { CuttedMenuSideBar } from '@/config/blocks/menu/menuSideBar/roles/cuttedMenuSideBar.ts';
import { TMenuConfig } from '@/components';

const filterMenuByPermissions = (menu: TMenuConfig, permissions: string[]): TMenuConfig => {
  return menu
    .map((item) => {
      if (
        item.requiredPermissions &&
        !item.requiredPermissions.some((perm) => permissions.includes(perm))
      ) {
        return null;
      }

      const filteredChildren = item.children
        ? filterMenuByPermissions(item.children, permissions)
        : undefined;

      return {
        ...item,
        children: filteredChildren
      };
    })
    .filter(Boolean) as TMenuConfig;
};

export const controlAccessLogic = (
  role?: string,
  permissions: string[] = []
): typeof MENU_SIDEBAR => {
  const roleToMenu: Record<string, typeof MENU_SIDEBAR> = {
    superadmin: AllMenuSideBar,
    viewer: ViewerMenuSideBar
  };
  if (role && roleToMenu[role]) {
    return roleToMenu[role];
  }
  return filterMenuByPermissions(CuttedMenuSideBar, permissions);
};

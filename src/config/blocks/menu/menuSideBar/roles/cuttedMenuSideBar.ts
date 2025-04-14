import type { TMenuConfig } from '@/components';

export const CuttedMenuSideBar: TMenuConfig = [
  {
    title: 'MENU.MEGAMENU.DASHBOARD',
    icon: 'element-11',
    path: '/'
  },
  {
    heading: 'MENU.MEGAMENU.SYSTEM'
  },
  {
    title: 'MENU.MEGAMENU.PROFILE',
    icon: 'profile-circle',
    path: '/profile'
  },
  //"manage global settings"
  {
    title: 'MENU.MEGAMENU.GLOBAL_PARAMETERS',
    icon: 'icon',
    requiredPermissions: ['manage global settings'],
    children: [
      {
        title: 'MENU.MEGAMENU.GLOBAL_PARAMETERS.PARAMETERS_STARTER',
        path: '/global-parameters/starter-parameters'
      },
      {
        title: 'MENU.MEGAMENU.GLOBAL_PARAMETERS.PARAMETERS',
        path: '/global-parameters/parameters'
      }
    ]
  },
  //"view global settings"
  {
    title: 'MENU.MEGAMENU.GLOBAL_PARAMETERS',
    icon: 'icon',
    path: '/global-parameters/parameters',
    requiredPermissions: ['view global settings']
  },
  //"manage global contexted settings"
  {
    title: 'MENU.MEGAMENU.GLOBAL_PARAMETERS',
    icon: 'icon',
    path: '/global-parameters/view-parameters/:id',
    requiredPermissions: ['manage global contexted settings']
  },
  //"view global contexted settings"
  {
    title: 'MENU.MEGAMENU.GLOBAL_PARAMETERS',
    icon: 'icon',
    path: '/global-parameters/view-parameters/:id',
    requiredPermissions: ['view global contexted settings']
  }
];

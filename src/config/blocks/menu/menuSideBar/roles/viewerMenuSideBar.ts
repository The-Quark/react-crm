import type { TMenuConfig } from '@/components';

export const ViewerMenuSideBar: TMenuConfig = [
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
  {
    title: 'MENU.MEGAMENU.GLOBAL_PARAMETERS',
    icon: 'icon',
    path: '/global-parameters/parameters'
  },
  {
    title: 'MENU.MEGAMENU.CLIENTS.CLIENTS',
    icon: 'badge',
    path: '/clients'
  },
  {
    title: 'MENU.MEGAMENU.ROLES_PERMISSIONS',
    icon: 'clipboard',
    children: [
      {
        title: 'MENU.MEGAMENU.ROLES_PERMISSIONS.ROLES',
        path: '/roles-permissions/roles'
      },
      {
        title: 'MENU.MEGAMENU.ROLES_PERMISSIONS.PERMISSIONS',
        path: '/roles-permissions/permissions'
      }
    ]
  },
  {
    title: 'MENU.MEGAMENU.HR_MODULE',
    icon: 'address-book',
    children: [
      {
        title: 'MENU.MEGAMENU.STAFF',
        path: '/hr-module/staff'
      },
      {
        title: 'MENU.MEGAMENU.DRIVERS',
        path: '/hr-module/drivers'
      },
      {
        title: 'MENU.MEGAMENU.COURIERS',
        path: '/hr-module/couriers'
      }
    ]
  },
  {
    title: 'MENU.MEGAMENU.CALL_CENTER',
    icon: 'satellite',
    children: [
      {
        title: 'MENU.MEGAMENU.CALL_CENTER.APPLICATIONS.LIST',
        path: '/call-center/applications/list'
      },
      {
        title: 'MENU.MEGAMENU.CALL_CENTER.ORDERS',
        path: '/call-center/orders'
      }
    ]
  },
  {
    title: 'MENU.MEGAMENU.CRM',
    icon: 'users',
    children: [
      {
        title: 'MENU.MEGAMENU.CRM.MEMBERS',
        path: '/crm/members'
      }
    ]
  },
  {
    title: 'MENU.MEGAMENU.GUIDES',
    icon: 'minus-folder',
    children: [
      {
        title: 'MENU.MEGAMENU.GUIDES.CURRENCIES',
        path: '/guides/currencies'
      },
      {
        title: 'MENU.MEGAMENU.GUIDES.COUNTRIES',
        path: '/guides/countries'
      },
      {
        title: 'MENU.MEGAMENU.GUIDES.CITIES',
        path: '/guides/cities'
      },
      {
        title: 'MENU.MEGAMENU.GUIDES.LANGUAGES',
        path: '/guides/languages'
      },
      {
        title: 'MENU.MEGAMENU.GUIDES.SOURCES',
        path: '/guides/sources'
      },
      {
        title: 'MENU.MEGAMENU.GUIDES.VEHICLES',
        path: '/guides/vehicles'
      },
      {
        title: 'MENU.MEGAMENU.GUIDES.AIRLINES',
        path: '/guides/airlines'
      },
      {
        title: 'MENU.MEGAMENU.GUIDES.PACKAGE_TYPES',
        path: '/guides/package-types'
      },
      {
        title: 'MENU.MEGAMENU.GUIDES.PACKAGE_MATERIALS',
        path: '/guides/package-materials'
      }
    ]
  }
];

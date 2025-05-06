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
    path: '/global-parameters/list'
  },
  {
    title: 'MENU.MEGAMENU.GUIDES',
    icon: 'minus-folder',
    requiredPermissions: ['manage global settings'],
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
        title: 'MENU.MEGAMENU.GUIDES.AIRLINE_RATES',
        path: '/guides/airline-rates'
      },
      {
        title: 'MENU.MEGAMENU.GUIDES.DELIVERY_TYPES',
        path: '/guides/delivery-types'
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
  },
  //"view global settings"
  {
    title: 'MENU.MEGAMENU.GLOBAL_PARAMETERS',
    icon: 'icon',
    path: '/global-parameters/list',
    requiredPermissions: ['view global settings']
  },
  {
    title: 'MENU.MEGAMENU.GUIDES',
    icon: 'minus-folder',
    requiredPermissions: ['view global settings'],
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
        title: 'MENU.MEGAMENU.GUIDES.AIRLINE_RATES',
        path: '/guides/airline-rates'
      },
      {
        title: 'MENU.MEGAMENU.GUIDES.DELIVERY_TYPES',
        path: '/guides/delivery-types'
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
  },
  //"manage users"
  {
    title: 'MENU.MEGAMENU.CRM',
    icon: 'users',
    requiredPermissions: ['manage users'],
    path: '/crm/members'
  },
  //"view users"
  {
    title: 'MENU.MEGAMENU.CRM',
    icon: 'users',
    path: '/crm/members',
    requiredPermissions: ['view users']
  },
  //"manage clients"
  {
    title: 'MENU.MEGAMENU.CLIENTS',
    icon: 'badge',
    requiredPermissions: ['manage clients'],
    path: '/clients'
  },
  //"view clients"
  {
    title: 'MENU.MEGAMENU.CLIENTS.CLIENTS',
    icon: 'badge',
    path: '/clients',
    requiredPermissions: ['view clients']
  },
  //"manage applications" and "manage orders"
  {
    title: 'MENU.MEGAMENU.CALL_CENTER',
    icon: 'satellite',
    requiredPermissions: ['manage applications', 'manage orders', 'view cargo'],
    children: [
      {
        title: 'MENU.MEGAMENU.CALL_CENTER.APPLICATIONS',
        requiredPermissions: ['manage applications'],
        path: '/call-center/applications/list'
      },
      {
        title: 'MENU.MEGAMENU.CALL_CENTER.ORDERS',
        requiredPermissions: ['manage orders'],
        path: '/call-center/orders/list'
      },
      {
        title: 'MENU.MEGAMENU.CALL_CENTER.CARGO',
        requiredPermissions: ['manage cargo'],
        path: '/call-center/cargo/list'
      }
    ]
  },
  //"view applications and view orders"
  {
    title: 'MENU.MEGAMENU.CALL_CENTER',
    icon: 'satellite',
    requiredPermissions: ['view applications', 'view orders', 'view cargo'],
    children: [
      {
        title: 'MENU.MEGAMENU.CALL_CENTER.APPLICATIONS',
        requiredPermissions: ['view applications'],
        path: '/call-center/applications/list'
      },
      {
        title: 'MENU.MEGAMENU.CALL_CENTER.ORDERS',
        requiredPermissions: ['view orders'],
        path: '/call-center/orders/list'
      },
      {
        title: 'MENU.MEGAMENU.CALL_CENTER.CARGO',
        requiredPermissions: ['view cargo'],
        path: '/call-center/cargo/list'
      }
    ]
  }
];

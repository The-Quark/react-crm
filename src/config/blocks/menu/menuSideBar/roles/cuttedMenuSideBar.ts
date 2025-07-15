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
        title: 'MENU.MEGAMENU.GLOBAL_PARAMETERS.COMPANIES',
        path: '/global-parameters/list'
      },
      {
        title: 'MENU.MEGAMENU.GLOBAL_PARAMETERS.DEPARTMENTS',
        path: '/global-parameters/departments/list'
      },
      {
        title: 'MENU.MEGAMENU.GLOBAL_PARAMETERS.SUBDIVISIONS',
        path: '/global-parameters/subdivisions/list'
      },
      {
        title: 'MENU.MEGAMENU.GLOBAL_PARAMETERS.POSITIONS',
        path: '/global-parameters/positions/list'
      }
    ]
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
        title: 'MENU.MEGAMENU.GUIDES.AIRPORTS',
        path: '/guides/airports'
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
        title: 'MENU.MEGAMENU.GUIDES.TARIFFS',
        path: '/guides/tariffs'
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
      },
      {
        title: 'MENU.MEGAMENU.GUIDES.UNITS',
        path: '/guides/units'
      },
      {
        title: 'MENU.MEGAMENU.GUIDES.TEMPLATES',
        path: '/guides/templates'
      },
      {
        title: 'MENU.MEGAMENU.GUIDES.FILE_TYPES',
        path: '/guides/file-types'
      },
      {
        title: 'MENU.MEGAMENU.GUIDES.BOX_TYPES',
        path: '/guides/box-types'
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
        title: 'MENU.MEGAMENU.GUIDES.AIRPORTS',
        path: '/guides/airports'
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
        title: 'MENU.MEGAMENU.GUIDES.TARIFFS',
        path: '/guides/tariffs'
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
      },
      {
        title: 'MENU.MEGAMENU.GUIDES.UNITS',
        path: '/guides/units'
      },
      {
        title: 'MENU.MEGAMENU.GUIDES.TEMPLATES',
        path: '/guides/templates'
      },
      {
        title: 'MENU.MEGAMENU.GUIDES.FILE_TYPES',
        path: '/guides/file-types'
      },
      {
        title: 'MENU.MEGAMENU.GUIDES.BOX_TYPES',
        path: '/guides/box-types'
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
    requiredPermissions: ['everything'],
    path: '/crm/users/list'
  },
  {
    title: 'MENU.MEGAMENU.HR_MODULE',
    icon: 'address-book',
    requiredPermissions: ['manage users'],
    children: [
      {
        title: 'MENU.MEGAMENU.STAFF',
        path: '/hr-module/staff/list'
      },
      {
        title: 'MENU.MEGAMENU.DRIVERS',
        path: '/hr-module/drivers/list'
      },
      {
        title: 'MENU.MEGAMENU.COURIERS',
        path: '/hr-module/couriers/list'
      }
    ]
  },
  //manage roles and manage permissions
  {
    title: 'MENU.MEGAMENU.ROLES_PERMISSIONS',
    icon: 'clipboard',
    requiredPermissions: ['manage roles'],
    path: '/roles-permissions/roles/list'
  },
  //view roles and view permissions
  {
    title: 'MENU.MEGAMENU.ROLES_PERMISSIONS',
    icon: 'clipboard',
    requiredPermissions: ['view roles'],
    path: '/roles-permissions/roles/list'
  },
  //"view users"
  {
    title: 'MENU.MEGAMENU.CRM',
    icon: 'users',
    path: '/crm/users/list',
    requiredPermissions: ['view everything']
  },
  {
    title: 'MENU.MEGAMENU.HR_MODULE',
    icon: 'address-book',
    requiredPermissions: ['view users'],
    children: [
      {
        title: 'MENU.MEGAMENU.STAFF',
        path: '/hr-module/staff/list'
      },
      {
        title: 'MENU.MEGAMENU.DRIVERS',
        path: '/hr-module/drivers/list'
      },
      {
        title: 'MENU.MEGAMENU.COURIERS',
        path: '/hr-module/couriers/list'
      }
    ]
  },
  //tasks
  {
    title: 'MENU.MEGAMENU.TASKS',
    icon: 'coffee',
    requiredPermissions: ['manage tasks', 'view tasks'],
    path: '/tasks/list'
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
    title: 'MENU.MEGAMENU.CLIENTS',
    icon: 'badge',
    path: '/clients',
    requiredPermissions: ['view clients']
  },
  //"manage applications" and "manage orders"
  {
    title: 'MENU.MEGAMENU.CALL_CENTER',
    icon: 'satellite',
    requiredPermissions: ['manage applications', 'manage orders'],
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
      }
    ]
  },
  {
    title: 'MENU.MEGAMENU.WAREHOUSE',
    icon: 'flag',
    requiredPermissions: ['manage orders'],
    children: [
      {
        title: 'MENU.MEGAMENU.WAREHOUSE.PACKAGES',
        requiredPermissions: ['manage orders'],
        path: '/warehouse/packages/list'
      },
      {
        title: 'MENU.MEGAMENU.WAREHOUSE.CARGO',
        requiredPermissions: ['manage orders'],
        path: '/warehouse/cargo/list'
      }
    ]
  },
  //"view applications and view orders"
  {
    title: 'MENU.MEGAMENU.CALL_CENTER',
    icon: 'satellite',
    requiredPermissions: ['view applications', 'view orders'],
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
      }
    ]
  },
  {
    title: 'MENU.MEGAMENU.WAREHOUSE',
    icon: 'flag',
    requiredPermissions: ['view orders'],
    children: [
      {
        title: 'MENU.MEGAMENU.WAREHOUSE.PACKAGES',
        requiredPermissions: ['view orders'],
        path: '/warehouse/packages/list'
      },
      {
        title: 'MENU.MEGAMENU.WAREHOUSE.CARGO',
        requiredPermissions: ['view orders'],
        path: '/warehouse/cargo/list'
      }
    ]
  }
];

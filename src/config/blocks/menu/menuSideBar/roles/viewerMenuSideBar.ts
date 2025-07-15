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
    title: 'MENU.MEGAMENU.TASKS',
    icon: 'coffee',
    path: '/tasks/list'
  },
  {
    title: 'MENU.MEGAMENU.CLIENTS',
    icon: 'badge',
    path: '/clients'
  },
  {
    title: 'MENU.MEGAMENU.ROLES_PERMISSIONS',
    icon: 'clipboard',
    path: '/roles-permissions/roles/list'
  },
  {
    title: 'MENU.MEGAMENU.HR_MODULE',
    icon: 'address-book',
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
  {
    title: 'MENU.MEGAMENU.CALL_CENTER',
    icon: 'satellite',
    children: [
      {
        title: 'MENU.MEGAMENU.CALL_CENTER.APPLICATIONS',
        path: '/call-center/applications/list'
      },
      {
        title: 'MENU.MEGAMENU.CALL_CENTER.ORDERS',
        path: '/call-center/orders/list'
      }
    ]
  },
  {
    title: 'MENU.MEGAMENU.WAREHOUSE',
    icon: 'flag',
    children: [
      {
        title: 'MENU.MEGAMENU.WAREHOUSE.PACKAGES',
        path: '/warehouse/packages/list'
      },
      {
        title: 'MENU.MEGAMENU.WAREHOUSE.CARGO',
        path: '/warehouse/cargo/list'
      }
    ]
  },
  {
    title: 'MENU.MEGAMENU.CRM',
    icon: 'users',
    path: '/crm/users/list'
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
  }
];

import type { TMenuConfig } from '@/components';

export const AllMenuMega: TMenuConfig = [
  {
    title: 'MENU.MEGAMENU.DASHBOARD',
    path: '/'
  },
  {
    title: 'MENU.MEGAMENU.PROFILE',
    path: '/profile'
  },
  {
    title: 'MENU.MEGAMENU.GLOBAL_PARAMETERS',
    children: [
      {
        title: 'MENU.MEGAMENU.GLOBAL_PARAMETERS.PARAMETERS_STARTER',
        icon: 'briefcase',
        path: '/global-parameters/starter-parameters'
      },
      {
        title: 'MENU.MEGAMENU.GLOBAL_PARAMETERS.PARAMETERS',
        icon: 'data',
        path: '/global-parameters/parameters'
      }
    ]
  },
  {
    title: 'MENU.MEGAMENU.CLIENTS',
    icon: 'badge',
    path: '/clients'
  },
  {
    title: 'MENU.MEGAMENU.ROLES_PERMISSIONS',
    children: [
      {
        title: 'MENU.MEGAMENU.ROLES_PERMISSIONS.ROLES',
        icon: 'briefcase',
        path: '/roles-permissions/roles'
      },
      {
        title: 'MENU.MEGAMENU.ROLES_PERMISSIONS.PERMISSIONS',
        icon: 'data',
        path: '/roles-permissions/permissions'
      }
    ]
  },
  {
    title: 'MENU.MEGAMENU.HR_MODULE',

    children: [
      {
        title: 'MENU.MEGAMENU.STAFF',
        path: '/hr-module/staff',
        icon: 'people'
      },
      {
        title: 'MENU.MEGAMENU.DRIVERS',
        path: '/hr-module/drivers',
        icon: 'delivery'
      },
      {
        title: 'MENU.MEGAMENU.COURIERS',
        path: '/hr-module/couriers',
        icon: 'courier'
      }
    ]
  },
  {
    title: 'MENU.MEGAMENU.CALL_CENTER',
    children: [
      {
        title: 'MENU.MEGAMENU.CALL_CENTER.APPLICATIONS',
        path: '/call-center/applications',
        icon: 'parcel-tracking'
      },
      {
        title: 'MENU.MEGAMENU.CALL_CENTER.ORDERS',
        path: '/call-center/orders',
        icon: 'delivery-3'
      }
    ]
  },
  {
    title: 'MENU.MEGAMENU.CRM',
    children: [
      {
        title: 'MENU.MEGAMENU.CRM.TEAMS_STARTER',
        icon: 'users',
        path: '/crm/teams-starter'
      },
      {
        title: 'MENU.MEGAMENU.CRM.TEAMS',
        icon: 'people',
        path: '/crm/teams'
      },
      {
        title: 'MENU.MEGAMENU.CRM.MEMBERS_STARTER',
        icon: 'user-edit',
        path: '/crm/member-starter'
      },
      {
        title: 'MENU.MEGAMENU.CRM.MEMBERS',
        icon: 'user',
        path: '/crm/members'
      }
    ]
  }
];

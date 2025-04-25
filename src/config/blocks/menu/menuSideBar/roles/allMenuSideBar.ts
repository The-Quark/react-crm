import type { TMenuConfig } from '@/components';

export const AllMenuSideBar: TMenuConfig = [
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
        title: 'MENU.MEGAMENU.GLOBAL_PARAMETERS.PARAMETERS_STARTER',
        path: '/global-parameters/starter-parameters'
      },
      {
        title: 'MENU.MEGAMENU.GLOBAL_PARAMETERS.PARAMETERS',
        path: '/global-parameters/parameters'
      }
    ]
  },
  {
    title: 'MENU.MEGAMENU.CLIENTS',
    icon: 'badge',
    children: [
      {
        title: 'MENU.MEGAMENU.CLIENTS.CLIENTS_STARTER',
        path: '/clients/starter-clients'
      },
      {
        title: 'MENU.MEGAMENU.CLIENTS.CLIENTS',
        path: '/clients'
      }
    ]
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
        title: 'MENU.MEGAMENU.CALL_CENTER.APPLICATIONS',
        path: '/call-center/applications'
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
        title: 'MENU.MEGAMENU.CRM.MEMBERS_STARTER',
        path: '/crm/member-starter'
      },
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
  },
  {
    heading: 'MENU.MEGAMENU.DEMONSTRATION'
  },
  {
    title: 'MENU.MEGAMENU.PUBLIC_PROFILE',
    icon: 'profile-circle',
    children: [
      {
        title: 'MENU.MEGAMENU.PUBLIC_PROFILE.PROFILES',
        children: [
          {
            title: 'MENU.MEGAMENU.PUBLIC_PROFILE.PROFILES.DEFAULT',
            path: '/public-profile/profiles/default'
          },
          {
            title: 'MENU.MEGAMENU.PUBLIC_PROFILE.PROFILES.CREATOR',
            path: '/public-profile/profiles/creator'
          },
          {
            title: 'MENU.MEGAMENU.PUBLIC_PROFILE.PROFILES.COMPANY',
            path: '/public-profile/profiles/company'
          },
          {
            title: 'MENU.MEGAMENU.PUBLIC_PROFILE.PROFILES.NFT',
            path: '/public-profile/profiles/nft'
          },
          {
            title: 'MENU.MEGAMENU.PUBLIC_PROFILE.PROFILES.BLOGGER',
            path: '/public-profile/profiles/blogger'
          },
          {
            title: 'MENU.MEGAMENU.PUBLIC_PROFILE.PROFILES.CRM',
            path: '/public-profile/profiles/crm'
          },
          {
            title: 'MENU.MEGAMENU.PUBLIC_PROFILE.PROFILES.MORE',
            collapse: true,
            collapseTitle: 'MENU.MEGAMENU.PUBLIC_PROFILE.PROFILES.SHOW_LESS',
            expandTitle: 'MENU.MEGAMENU.PUBLIC_PROFILE.PROFILES.SHOW_4_MORE',
            dropdownProps: {
              placement: 'right-start'
            },
            children: [
              {
                title: 'MENU.MEGAMENU.PUBLIC_PROFILE.PROFILES.GAMER',
                path: '/public-profile/profiles/gamer'
              },
              {
                title: 'MENU.MEGAMENU.PUBLIC_PROFILE.PROFILES.FEEDS',
                path: '/public-profile/profiles/feeds'
              },
              {
                title: 'MENU.MEGAMENU.PUBLIC_PROFILE.PROFILES.PLAIN',
                path: '/public-profile/profiles/plain'
              },
              {
                title: 'MENU.MEGAMENU.PUBLIC_PROFILE.PROFILES.MODAL',
                path: '/public-profile/profiles/modal'
              }
            ]
          }
        ]
      },
      {
        title: 'MENU.MEGAMENU.PUBLIC_PROFILE.PROJECTS',
        children: [
          {
            title: 'MENU.MEGAMENU.PUBLIC_PROFILE.PROJECTS.3_COLUMNS',
            path: '/public-profile/projects/3-columns'
          },
          {
            title: 'MENU.MEGAMENU.PUBLIC_PROFILE.PROJECTS.2_COLUMNS',
            path: '/public-profile/projects/2-columns'
          }
        ]
      },
      {
        title: 'MENU.MEGAMENU.PUBLIC_PROFILE.WORKS',
        path: '/public-profile/works'
      },
      {
        title: 'MENU.MEGAMENU.PUBLIC_PROFILE.TEAMS',
        path: '/public-profile/teams'
      },
      {
        title: 'MENU.MEGAMENU.PUBLIC_PROFILE.NETWORK',
        path: '/public-profile/network'
      },
      {
        title: 'MENU.MEGAMENU.PUBLIC_PROFILE.ACTIVITY',
        path: '/public-profile/activity'
      },
      {
        title: 'MENU.MEGAMENU.PUBLIC_PROFILE.MORE',
        collapse: true,
        collapseTitle: 'MENU.MEGAMENU.PUBLIC_PROFILE.SHOW_LESS',
        expandTitle: 'MENU.MEGAMENU.PUBLIC_PROFILE.SHOW_3_MORE',
        dropdownProps: {
          placement: 'right-start'
        },
        children: [
          {
            title: 'MENU.MEGAMENU.PUBLIC_PROFILE.CAMPAIGNS_CARD',
            path: '/public-profile/campaigns/card'
          },
          {
            title: 'MENU.MEGAMENU.PUBLIC_PROFILE.CAMPAIGNS_LIST',
            path: '/public-profile/campaigns/list'
          },
          {
            title: 'MENU.MEGAMENU.PUBLIC_PROFILE.EMPTY',
            path: '/public-profile/empty'
          }
        ]
      }
    ]
  },
  {
    title: 'MENU.MEGAMENU.MY_ACCOUNT',
    icon: 'setting-2',
    children: [
      {
        title: 'MENU.MEGAMENU.MY_ACCOUNT.ACCOUNT',
        children: [
          {
            title: 'MENU.MEGAMENU.MY_ACCOUNT.ACCOUNT.GET_STARTED',
            path: '/account/home/get-started'
          },
          {
            title: 'MENU.MEGAMENU.MY_ACCOUNT.ACCOUNT.USER_PROFILE',
            path: '/account/home/user-profile'
          },
          {
            title: 'MENU.MEGAMENU.MY_ACCOUNT.ACCOUNT.COMPANY_PROFILE',
            path: '/account/home/company-profile'
          },
          {
            title: 'MENU.MEGAMENU.MY_ACCOUNT.ACCOUNT.SETTINGS_SIDEBAR',
            path: '/account/home/settings-sidebar'
          },
          {
            title: 'MENU.MEGAMENU.MY_ACCOUNT.ACCOUNT.SETTINGS_ENTERPRISE',
            path: '/account/home/settings-enterprise'
          },
          {
            title: 'MENU.MEGAMENU.MY_ACCOUNT.ACCOUNT.SETTINGS_PLAIN',
            path: '/account/home/settings-plain'
          },
          {
            title: 'MENU.MEGAMENU.MY_ACCOUNT.ACCOUNT.SETTINGS_MODAL',
            path: '/account/home/settings-modal'
          }
        ]
      },
      {
        title: 'MENU.MEGAMENU.MY_ACCOUNT.BILLING',
        children: [
          {
            title: 'MENU.MEGAMENU.MY_ACCOUNT.BILLING.BASIC',
            path: '/account/billing/basic'
          },
          {
            title: 'MENU.MEGAMENU.MY_ACCOUNT.BILLING.ENTERPRISE',
            path: '/account/billing/enterprise'
          },
          {
            title: 'MENU.MEGAMENU.MY_ACCOUNT.BILLING.PLANS',
            path: '/account/billing/plans'
          },
          {
            title: 'MENU.MEGAMENU.MY_ACCOUNT.BILLING.HISTORY',
            path: '/account/billing/history'
          }
        ]
      },
      {
        title: 'MENU.MEGAMENU.MY_ACCOUNT.SECURITY',
        children: [
          {
            title: 'MENU.MEGAMENU.MY_ACCOUNT.SECURITY.GET_STARTED',
            path: '/account/security/get-started'
          },
          {
            title: 'MENU.MEGAMENU.MY_ACCOUNT.SECURITY.OVERVIEW',
            path: '/account/security/overview'
          },
          {
            title: 'MENU.MEGAMENU.MY_ACCOUNT.SECURITY.ALLOWED_IP_ADDRESSES',
            path: '/account/security/allowed-ip-addresses'
          },
          {
            title: 'MENU.MEGAMENU.MY_ACCOUNT.SECURITY.PRIVACY_SETTINGS',
            path: '/account/security/privacy-settings'
          },
          {
            title: 'MENU.MEGAMENU.MY_ACCOUNT.SECURITY.DEVICE_MANAGEMENT',
            path: '/account/security/device-management'
          },
          {
            title: 'MENU.MEGAMENU.MY_ACCOUNT.SECURITY.BACKUP_RECOVERY',
            path: '/account/security/backup-and-recovery'
          },
          {
            title: 'MENU.MEGAMENU.MY_ACCOUNT.SECURITY.CURRENT_SESSIONS',
            path: '/account/security/current-sessions'
          },
          {
            title: 'MENU.MEGAMENU.MY_ACCOUNT.SECURITY.SECURITY_LOG',
            path: '/account/security/security-log'
          }
        ]
      },
      {
        title: 'MENU.MEGAMENU.MY_ACCOUNT.MEMBERS_ROLES',
        children: [
          {
            title: 'MENU.MEGAMENU.MY_ACCOUNT.MEMBERS_ROLES.TEAMS_STARTER',
            path: '/account/members/team-starter'
          },
          {
            title: 'MENU.MEGAMENU.MY_ACCOUNT.MEMBERS_ROLES.TEAMS',
            path: '/account/members/teams'
          },
          {
            title: 'MENU.MEGAMENU.MY_ACCOUNT.MEMBERS_ROLES.TEAM_INFO',
            path: '/account/members/team-info'
          },
          {
            title: 'MENU.MEGAMENU.MY_ACCOUNT.MEMBERS_ROLES.MEMBER_STARTER',
            path: '/account/members/member-starter'
          },
          {
            title: 'MENU.MEGAMENU.MY_ACCOUNT.MEMBERS_ROLES.TEAM_MEMBERS',
            path: '/account/members/team-members'
          },
          {
            title: 'MENU.MEGAMENU.MY_ACCOUNT.MEMBERS_ROLES.IMPORT_MEMBERS',
            path: '/account/members/import-members'
          },
          {
            title: 'MENU.MEGAMENU.MY_ACCOUNT.MEMBERS_ROLES.ROLES',
            path: '/account/members/roles'
          },
          {
            title: 'MENU.MEGAMENU.MY_ACCOUNT.MEMBERS_ROLES.PERMISSIONS_TOGGLER',
            path: '/account/members/permissions-toggle'
          },
          {
            title: 'MENU.MEGAMENU.MY_ACCOUNT.MEMBERS_ROLES.PERMISSIONS_CHECK',
            path: '/account/members/permissions-check'
          }
        ]
      },
      {
        title: 'MENU.MEGAMENU.MY_ACCOUNT.INTEGRATIONS',
        path: '/account/integrations'
      },
      {
        title: 'MENU.MEGAMENU.MY_ACCOUNT.NOTIFICATIONS',
        path: '/account/notifications'
      },
      {
        title: 'MENU.MEGAMENU.MY_ACCOUNT.API_KEYS',
        path: '/account/api-keys'
      },
      {
        title: 'MENU.MEGAMENU.MY_ACCOUNT.MORE',
        collapse: true,
        collapseTitle: 'MENU.MEGAMENU.MY_ACCOUNT.MORE.SHOW_LESS',
        expandTitle: 'MENU.MEGAMENU.MY_ACCOUNT.MORE.SHOW_3_MORE',
        dropdownProps: {
          placement: 'right-start'
        },
        children: [
          {
            title: 'MENU.MEGAMENU.MY_ACCOUNT.MORE.APPEARANCE',
            path: '/account/appearance'
          },
          {
            title: 'MENU.MEGAMENU.MY_ACCOUNT.MORE.INVITE_A_FRIEND',
            path: '/account/invite-a-friend'
          },
          {
            title: 'MENU.MEGAMENU.MY_ACCOUNT.MORE.ACTIVITY',
            path: '/account/activity'
          }
        ]
      }
    ]
  },
  {
    title: 'MENU.MEGAMENU.NETWORK',
    icon: 'users',
    children: [
      {
        title: 'MENU.MEGAMENU.NETWORK.GET_STARTED',
        path: '/network/get-started'
      },
      {
        title: 'MENU.MEGAMENU.NETWORK.USER_CARDS',
        children: [
          {
            title: 'MENU.MEGAMENU.NETWORK.USER_CARDS.MINI_CARDS',
            path: '/network/user-cards/mini-cards'
          },
          {
            title: 'MENU.MEGAMENU.NETWORK.USER_CARDS.TEAM_CREW',
            path: '/network/user-cards/team-crew'
          },
          {
            title: 'MENU.MEGAMENU.NETWORK.USER_CARDS.AUTHOR',
            path: '/network/user-cards/author'
          },
          {
            title: 'MENU.MEGAMENU.NETWORK.USER_CARDS.NFT',
            path: '/network/user-cards/nft'
          },
          {
            title: 'MENU.MEGAMENU.NETWORK.USER_CARDS.SOCIAL',
            path: '/network/user-cards/social'
          }
        ]
      },
      {
        title: 'MENU.MEGAMENU.NETWORK.USER_TABLE',
        children: [
          {
            title: 'MENU.MEGAMENU.NETWORK.USER_TABLE.TEAM_CREW',
            path: '/network/user-table/team-crew'
          },
          {
            title: 'MENU.MEGAMENU.NETWORK.USER_TABLE.APP_ROSTER',
            path: '/network/user-table/app-roster'
          },
          {
            title: 'MENU.MEGAMENU.NETWORK.USER_TABLE.MARKET_AUTHORS',
            path: '/network/user-table/market-authors'
          },
          {
            title: 'MENU.MEGAMENU.NETWORK.USER_TABLE.SAAS_USERS',
            path: '/network/user-table/saas-users'
          },
          {
            title: 'MENU.MEGAMENU.NETWORK.USER_TABLE.STORE_CLIENTS',
            path: '/network/user-table/store-clients'
          },
          {
            title: 'MENU.MEGAMENU.NETWORK.USER_TABLE.VISITORS',
            path: '/network/user-table/visitors'
          }
        ]
      },
      {
        title: 'MENU.MEGAMENU.NETWORK.COOPERATIONS',
        path: '/network/cooperations',
        disabled: true
      }
    ]
  },
  {
    title: 'MENU.MEGAMENU.AUTHENTICATION',
    icon: 'security-user',
    children: [
      {
        title: 'MENU.MEGAMENU.AUTHENTICATION.CLASSIC',
        children: [
          {
            title: 'MENU.MEGAMENU.AUTHENTICATION.CLASSIC.SIGN_IN',
            path: '/auth/classic/login'
          },
          {
            title: 'MENU.MEGAMENU.AUTHENTICATION.CLASSIC.SIGN_UP',
            path: '/auth/classic/signup'
          },
          {
            title: 'MENU.MEGAMENU.AUTHENTICATION.CLASSIC.TWO_FA',
            path: '/auth/classic/2fa'
          },
          {
            title: 'MENU.MEGAMENU.AUTHENTICATION.CLASSIC.CHECK_EMAIL',
            path: '/auth/classic/check-email'
          },
          {
            title: 'MENU.MEGAMENU.AUTHENTICATION.CLASSIC.RESET_PASSWORD',
            children: [
              {
                title: 'MENU.MEGAMENU.AUTHENTICATION.CLASSIC.RESET_PASSWORD.ENTER_EMAIL',
                path: '/auth/classic/reset-password/enter-email'
              },
              {
                title: 'MENU.MEGAMENU.AUTHENTICATION.CLASSIC.RESET_PASSWORD.CHECK_EMAIL',
                path: '/auth/classic/reset-password/check-email'
              },
              {
                title: 'MENU.MEGAMENU.AUTHENTICATION.CLASSIC.RESET_PASSWORD.CHANGE',
                path: '/auth/classic/reset-password/change'
              },
              {
                title: 'MENU.MEGAMENU.AUTHENTICATION.CLASSIC.RESET_PASSWORD.CHANGED',
                path: '/auth/classic/reset-password/changed'
              }
            ]
          }
        ]
      },
      {
        title: 'MENU.MEGAMENU.AUTHENTICATION.BRANDED',
        children: [
          {
            title: 'MENU.MEGAMENU.AUTHENTICATION.BRANDED.SIGN_IN',
            path: '/auth/login'
          },
          {
            title: 'MENU.MEGAMENU.AUTHENTICATION.BRANDED.SIGN_UP',
            path: '/auth/signup'
          },
          {
            title: 'MENU.MEGAMENU.AUTHENTICATION.BRANDED.TWO_FA',
            path: '/auth/2fa'
          },
          {
            title: 'MENU.MEGAMENU.AUTHENTICATION.BRANDED.CHECK_EMAIL',
            path: '/auth/check-email'
          },
          {
            title: 'MENU.MEGAMENU.AUTHENTICATION.BRANDED.RESET_PASSWORD',
            children: [
              {
                title: 'MENU.MEGAMENU.AUTHENTICATION.BRANDED.RESET_PASSWORD.ENTER_EMAIL',
                path: '/auth/reset-password/enter-email'
              },
              {
                title: 'MENU.MEGAMENU.AUTHENTICATION.BRANDED.RESET_PASSWORD.CHECK_EMAIL',
                path: '/auth/reset-password/check-email'
              },
              {
                title: 'MENU.MEGAMENU.AUTHENTICATION.BRANDED.RESET_PASSWORD.CHANGE',
                path: '/auth/reset-password/change'
              },
              {
                title: 'MENU.MEGAMENU.AUTHENTICATION.BRANDED.RESET_PASSWORD.CHANGED',
                path: '/auth/reset-password/changed'
              }
            ]
          }
        ]
      },
      {
        title: 'MENU.MEGAMENU.AUTHENTICATION.WELCOME_MESSAGE',
        path: '/auth/welcome-message'
      },
      {
        title: 'MENU.MEGAMENU.AUTHENTICATION.ACCOUNT_DEACTIVATED',
        path: '/auth/account-deactivated'
      },
      {
        title: 'MENU.MEGAMENU.AUTHENTICATION.ERROR_404',
        path: '/error/404'
      },
      {
        title: 'MENU.MEGAMENU.AUTHENTICATION.ERROR_500',
        path: '/error/500'
      }
    ]
  }
];

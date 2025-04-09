import type { TMenuConfig } from '@/components';

export const MENU_SIDEBAR: TMenuConfig = [
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
    path: '/global-parameters'
  },
  {
    title: 'MENU.MEGAMENU.CLIENTS',
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
        title: 'MENU.MEGAMENU.CRM.TEAMS_STARTER',
        path: '/crm/teams-starter'
      },
      {
        title: 'MENU.MEGAMENU.CRM.TEAMS',
        path: '/crm/teams'
      },
      {
        title: 'MENU.MEGAMENU.CRM.MEMBERS_STARTER',
        path: '/crm/member-starter'
      },
      {
        title: 'MENU.MEGAMENU.CRM.MEMBERS',
        path: '/crm/members'
      }
    ]
  }
  // {
  //   heading: 'Demonstration'
  // },
  // {
  //   title: 'Public Profile',
  //   icon: 'profile-circle',
  //   children: [
  //     {
  //       title: 'Profiles',
  //       children: [
  //         {
  //           title: 'Default',
  //           path: '/public-profile/profiles/default'
  //         },
  //         {
  //           title: 'Creator',
  //           path: '/public-profile/profiles/creator'
  //         },
  //         {
  //           title: 'Company',
  //           path: '/public-profile/profiles/company'
  //         },
  //         {
  //           title: 'NFT',
  //           path: '/public-profile/profiles/nft'
  //         },
  //         {
  //           title: 'Blogger',
  //           path: '/public-profile/profiles/blogger'
  //         },
  //         {
  //           title: 'CRM',
  //           path: '/public-profile/profiles/crm'
  //         },
  //         {
  //           title: 'More',
  //           collapse: true,
  //           collapseTitle: 'Show less',
  //           expandTitle: 'Show 4 more',
  //           dropdownProps: {
  //             placement: 'right-start'
  //           },
  //           children: [
  //             {
  //               title: 'Gamer',
  //               path: '/public-profile/profiles/gamer'
  //             },
  //             {
  //               title: 'Feeds',
  //               path: '/public-profile/profiles/feeds'
  //             },
  //             {
  //               title: 'Plain',
  //               path: '/public-profile/profiles/plain'
  //             },
  //             {
  //               title: 'Modal',
  //               path: '/public-profile/profiles/modal'
  //             }
  //           ]
  //         }
  //       ]
  //     },
  //     {
  //       title: 'Projects',
  //       children: [
  //         {
  //           title: '3 Columns',
  //           path: '/public-profile/projects/3-columns'
  //         },
  //         {
  //           title: '2 Columns',
  //           path: '/public-profile/projects/2-columns'
  //         }
  //       ]
  //     },
  //     {
  //       title: 'Works',
  //       path: '/public-profile/works'
  //     },
  //     {
  //       title: 'Teams',
  //       path: '/public-profile/teams'
  //     },
  //     {
  //       title: 'Network',
  //       path: '/public-profile/network'
  //     },
  //     {
  //       title: 'Activity',
  //       path: '/public-profile/activity'
  //     },
  //     {
  //       title: 'More',
  //       collapse: true,
  //       collapseTitle: 'Show less',
  //       expandTitle: 'Show 3 more',
  //       dropdownProps: {
  //         placement: 'right-start'
  //       },
  //       children: [
  //         {
  //           title: 'Campaigns - Card',
  //           path: '/public-profile/campaigns/card'
  //         },
  //         {
  //           title: 'Campaigns - List',
  //           path: '/public-profile/campaigns/list'
  //         },
  //         {
  //           title: 'Empty',
  //           path: '/public-profile/empty'
  //         }
  //       ]
  //     }
  //   ]
  // },
  // {
  //   title: 'My Account',
  //   icon: 'setting-2',
  //   children: [
  //     {
  //       title: 'Account',
  //       children: [
  //         {
  //           title: 'Get Started',
  //           path: '/account/home/get-started'
  //         },
  //         {
  //           title: 'User Profile',
  //           path: '/account/home/user-profile'
  //         },
  //         {
  //           title: 'Company Profile',
  //           path: '/account/home/company-profile'
  //         },
  //         {
  //           title: 'Settings - With Sidebar',
  //           path: '/account/home/settings-sidebar'
  //         },
  //         {
  //           title: 'Settings - Enterprise',
  //           path: '/account/home/settings-enterprise'
  //         },
  //         {
  //           title: 'Settings - Plain',
  //           path: '/account/home/settings-plain'
  //         },
  //         {
  //           title: 'Settings - Modal',
  //           path: '/account/home/settings-modal'
  //         }
  //       ]
  //     },
  //     {
  //       title: 'Billing',
  //       children: [
  //         {
  //           title: 'Billing - Basic',
  //           path: '/account/billing/basic'
  //         },
  //         {
  //           title: 'Billing - Enterprise',
  //           path: '/account/billing/enterprise'
  //         },
  //         {
  //           title: 'Plans',
  //           path: '/account/billing/plans'
  //         },
  //         {
  //           title: 'Billing History',
  //           path: '/account/billing/history'
  //         }
  //       ]
  //     },
  //     {
  //       title: 'Security',
  //       children: [
  //         {
  //           title: 'Get Started',
  //           path: '/account/security/get-started'
  //         },
  //         {
  //           title: 'Security Overview',
  //           path: '/account/security/overview'
  //         },
  //         {
  //           title: 'Allowed IP Addresses',
  //           path: '/account/security/allowed-ip-addresses'
  //         },
  //         {
  //           title: 'Privacy Settings',
  //           path: '/account/security/privacy-settings'
  //         },
  //         {
  //           title: 'Device Management',
  //           path: '/account/security/device-management'
  //         },
  //         {
  //           title: 'Backup & Recovery',
  //           path: '/account/security/backup-and-recovery'
  //         },
  //         {
  //           title: 'Current Sessions',
  //           path: '/account/security/current-sessions'
  //         },
  //         {
  //           title: 'Security Log',
  //           path: '/account/security/security-log'
  //         }
  //       ]
  //     },
  //     {
  //       title: 'Members & Roles',
  //       children: [
  //         {
  //           title: 'Teams Starter',
  //           path: '/account/members/team-starter'
  //         },
  //         {
  //           title: 'Teams',
  //           path: '/account/members/teams'
  //         },
  //         {
  //           title: 'Team Info',
  //           path: '/account/members/team-info'
  //         },
  //         {
  //           title: 'Member Starter',
  //           path: '/account/members/member-starter'
  //         },
  //         {
  //           title: 'Team Members',
  //           path: '/account/members/team-members'
  //         },
  //         {
  //           title: 'Import Members',
  //           path: '/account/members/import-members'
  //         },
  //         {
  //           title: 'Roles',
  //           path: '/account/members/roles'
  //         },
  //         {
  //           title: 'Permissions - Toggler',
  //           path: '/account/members/permissions-toggle'
  //         },
  //         {
  //           title: 'Permissions - Check',
  //           path: '/account/members/permissions-check'
  //         }
  //       ]
  //     },
  //     {
  //       title: 'Integrations',
  //       path: '/account/integrations'
  //     },
  //     {
  //       title: 'Notifications',
  //       path: '/account/notifications'
  //     },
  //     {
  //       title: 'API Keys',
  //       path: '/account/api-keys'
  //     },
  //     {
  //       title: 'More',
  //       collapse: true,
  //       collapseTitle: 'Show less',
  //       expandTitle: 'Show 3 more',
  //       dropdownProps: {
  //         placement: 'right-start'
  //       },
  //       children: [
  //         {
  //           title: 'Appearance',
  //           path: '/account/appearance'
  //         },
  //         {
  //           title: 'Invite a Friend',
  //           path: '/account/invite-a-friend'
  //         },
  //         {
  //           title: 'Activity',
  //           path: '/account/activity'
  //         }
  //       ]
  //     }
  //   ]
  // },
  // {
  //   title: 'Network',
  //   icon: 'users',
  //   children: [
  //     {
  //       title: 'Get Started',
  //       path: '/network/get-started'
  //     },
  //     {
  //       title: 'User Cards',
  //       children: [
  //         {
  //           title: 'Mini Cards',
  //           path: '/network/user-cards/mini-cards'
  //         },
  //         {
  //           title: 'Team Crew',
  //           path: '/network/user-cards/team-crew'
  //         },
  //         {
  //           title: 'Author',
  //           path: '/network/user-cards/author'
  //         },
  //         {
  //           title: 'NFT',
  //           path: '/network/user-cards/nft'
  //         },
  //         {
  //           title: 'Social',
  //           path: '/network/user-cards/social'
  //         }
  //       ]
  //     },
  //     {
  //       title: 'User Table',
  //       children: [
  //         {
  //           title: 'Team Crew',
  //           path: '/network/user-table/team-crew'
  //         },
  //         {
  //           title: 'App Roster',
  //           path: '/network/user-table/app-roster'
  //         },
  //         {
  //           title: 'Market Authors',
  //           path: '/network/user-table/market-authors'
  //         },
  //         {
  //           title: 'SaaS Users',
  //           path: '/network/user-table/saas-users'
  //         },
  //         {
  //           title: 'Store Clients',
  //           path: '/network/user-table/store-clients'
  //         },
  //         {
  //           title: 'Visitors',
  //           path: '/network/user-table/visitors'
  //         }
  //       ]
  //     },
  //     {
  //       title: 'Cooperations',
  //       path: '/network/cooperations',
  //       disabled: true
  //     }
  //   ]
  // },
  // {
  //   title: 'Authentication',
  //   icon: 'security-user',
  //   children: [
  //     {
  //       title: 'Classic',
  //       children: [
  //         {
  //           title: 'Sign In',
  //           path: '/auth/classic/login'
  //         },
  //         {
  //           title: 'Sign Up',
  //           path: '/auth/classic/signup'
  //         },
  //         {
  //           title: '2FA',
  //           path: '/auth/classic/2fa'
  //         },
  //         {
  //           title: 'Check Email',
  //           path: '/auth/classic/check-email'
  //         },
  //         {
  //           title: 'Reset Password',
  //           children: [
  //             {
  //               title: 'Enter Email',
  //               path: '/auth/classic/reset-password/enter-email'
  //             },
  //             {
  //               title: 'Check Email',
  //               path: '/auth/classic/reset-password/check-email'
  //             },
  //             {
  //               title: 'Change Password',
  //               path: '/auth/classic/reset-password/change'
  //             },
  //             {
  //               title: 'Password Changed',
  //               path: '/auth/classic/reset-password/changed'
  //             }
  //           ]
  //         }
  //       ]
  //     },
  //     {
  //       title: 'Branded',
  //       children: [
  //         {
  //           title: 'Sign In',
  //           path: '/auth/login'
  //         },
  //         {
  //           title: 'Sign Up',
  //           path: '/auth/signup'
  //         },
  //         {
  //           title: '2FA',
  //           path: '/auth/2fa'
  //         },
  //         {
  //           title: 'Check Email',
  //           path: '/auth/check-email'
  //         },
  //         {
  //           title: 'Reset Password',
  //           children: [
  //             {
  //               title: 'Enter Email',
  //               path: '/auth/reset-password/enter-email'
  //             },
  //             {
  //               title: 'Check Email',
  //               path: '/auth/reset-password/check-email'
  //             },
  //             {
  //               title: 'Change Password',
  //               path: '/auth/reset-password/change'
  //             },
  //             {
  //               title: 'Password Changed',
  //               path: '/auth/reset-password/changed'
  //             }
  //           ]
  //         }
  //       ]
  //     },
  //     {
  //       title: 'Welcome Message',
  //       path: '/auth/welcome-message'
  //     },
  //     {
  //       title: 'Account Deactivated',
  //       path: '/auth/account-deactivated'
  //     },
  //     {
  //       title: 'Error 404',
  //       path: '/error/404'
  //     },
  //     {
  //       title: 'Error 500',
  //       path: '/error/500'
  //     }
  //   ]
  // }
];

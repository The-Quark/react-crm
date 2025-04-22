import React from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { DefaultPage } from '@/pages/dashboards';
import { ProfilePage } from '@/pages/profile/profilePage.tsx';
import { PermissionPage, RolesPage } from '@/pages/roles-permissions';
import StaffPage from '@/pages/hr-module/staff/staffPage.tsx';
import DriversPage from '@/pages/hr-module/drivers/driversPage.tsx';
import CouriersPage from '@/pages/hr-module/couriers/couriersPage.tsx';
import ApplicationsPage from '@/pages/call-center/applications/applicationsPage.tsx';
import OrdersPage from '@/pages/call-center/orders/ordersPage.tsx';
import {
  MemberRoleUpdatePage,
  MembersPage,
  MemberStarterPage,
  MemberUpdatePage,
  MemberPublicProfilePage
} from '@/pages/crm';
import {
  GlobalParameterStarterPage,
  GlobalParametersListPage,
  GlobalParameterViewPage,
  GlobalParameterUpdatePage
} from '@/pages/global-parameters';
import {
  CampaignsCardPage,
  CampaignsListPage,
  ProfileActivityPage,
  ProfileBloggerPage,
  ProfileCompanyPage,
  ProfileCreatorPage,
  ProfileCRMPage,
  ProfileDefaultPage,
  ProfileEmptyPage,
  ProfileFeedsPage,
  ProfileGamerPage,
  ProfileModalPage,
  ProfileNetworkPage,
  ProfileNFTPage,
  ProfilePlainPage,
  ProfileTeamsPage,
  ProfileWorksPage,
  ProjectColumn2Page,
  ProjectColumn3Page
} from '@/pages/public-profile';
import {
  AccountActivityPage,
  AccountAllowedIPAddressesPage,
  AccountApiKeysPage,
  AccountAppearancePage,
  AccountBackupAndRecoveryPage,
  AccountBasicPage,
  AccountCompanyProfilePage,
  AccountCurrentSessionsPage,
  AccountDeviceManagementPage,
  AccountEnterprisePage,
  AccountGetStartedPage,
  AccountHistoryPage,
  AccountImportMembersPage,
  AccountIntegrationsPage,
  AccountInviteAFriendPage,
  AccountMembersStarterPage,
  AccountNotificationsPage,
  AccountOverviewPage,
  AccountPermissionsCheckPage,
  AccountPermissionsTogglePage,
  AccountPlansPage,
  AccountPrivacySettingsPage,
  AccountRolesPage,
  AccountSecurityGetStartedPage,
  AccountSecurityLogPage,
  AccountSettingsEnterprisePage,
  AccountSettingsModalPage,
  AccountSettingsPlainPage,
  AccountSettingsSidebarPage,
  AccountTeamInfoPage,
  AccountTeamMembersPage,
  AccountTeamsPage,
  AccountTeamsStarterPage,
  AccountUserProfilePage
} from '@/pages/account';
import {
  NetworkAppRosterPage,
  NetworkAuthorPage,
  NetworkGetStartedPage,
  NetworkMarketAuthorsPage,
  NetworkMiniCardsPage,
  NetworkNFTPage,
  NetworkSaasUsersPage,
  NetworkSocialPage,
  NetworkStoreClientsPage,
  NetworkUserCardsTeamCrewPage,
  NetworkUserTableTeamCrewPage,
  NetworkVisitorsPage
} from '@/pages/network';
import {
  AuthenticationAccountDeactivatedPage,
  AuthenticationGetStartedPage,
  AuthenticationWelcomeMessagePage
} from '@/pages/authentication';
import { Demo1Layout } from '@/layouts/demo1';
import { ErrorsRouting } from '@/errors';
import { AuthPage } from '@/auth';
import { ClientsListPage, ClientStarterPage, ClientUpdatePage } from '@/pages/clients';
import {
  GuidesCurrenciesPage,
  GuidesLanguagesPage,
  GuidesVehiclesPage,
  GuidesSourcesPage
} from '@/pages/guides';

const AllRoutesSetting = () => {
  return (
    <Routes>
      <Route element={<Demo1Layout />}>
        <Route path="/" element={<DefaultPage />} />

        <Route path="/profile" element={<ProfilePage />} />

        <Route
          path="/global-parameters/starter-parameters"
          element={<GlobalParameterStarterPage />}
        />
        <Route
          path="/global-parameters/update-parameters/:id"
          element={<GlobalParameterUpdatePage />}
        />
        <Route
          path="/global-parameters/view-parameters/:id"
          element={<GlobalParameterViewPage />}
        />
        <Route path="/global-parameters/parameters" element={<GlobalParametersListPage />} />

        <Route path="/roles-permissions/roles" element={<RolesPage />} />
        <Route path="/roles-permissions/permissions" element={<PermissionPage />} />

        <Route path="/clients" element={<ClientsListPage />} />
        <Route path="/clients/starter-clients" element={<ClientStarterPage />} />
        <Route path="/clients/client-update/:id" element={<ClientUpdatePage />} />

        <Route path="/hr-module/staff" element={<StaffPage />} />
        <Route path="/hr-module/drivers" element={<DriversPage />} />
        <Route path="/hr-module/couriers" element={<CouriersPage />} />

        <Route path="/call-center/applications" element={<ApplicationsPage />} />
        <Route path="/call-center/orders" element={<OrdersPage />} />

        <Route path="/crm/member-starter" element={<MemberStarterPage />} />
        <Route path="/crm/member-role-update/:id" element={<MemberRoleUpdatePage />} />
        <Route path="/crm/member-update/:id" element={<MemberUpdatePage />} />
        <Route path="/crm/members" element={<MembersPage />} />
        <Route path="/crm/member/profile/:id" element={<MemberPublicProfilePage />} />

        <Route path="/guides/currencies" element={<GuidesCurrenciesPage />} />
        <Route path="/guides/languages" element={<GuidesLanguagesPage />} />
        <Route path="/guides/sources" element={<GuidesSourcesPage />} />
        <Route path="/guides/vehicles" element={<GuidesVehiclesPage />} />

        <Route path="/public-profile/profiles/default" element={<ProfileDefaultPage />} />
        <Route path="/public-profile/profiles/creator" element={<ProfileCreatorPage />} />
        <Route path="/public-profile/profiles/company" element={<ProfileCompanyPage />} />
        <Route path="/public-profile/profiles/nft" element={<ProfileNFTPage />} />
        <Route path="/public-profile/profiles/blogger" element={<ProfileBloggerPage />} />
        <Route path="/public-profile/profiles/crm" element={<ProfileCRMPage />} />
        <Route path="/public-profile/profiles/gamer" element={<ProfileGamerPage />} />
        <Route path="/public-profile/profiles/feeds" element={<ProfileFeedsPage />} />
        <Route path="/public-profile/profiles/plain" element={<ProfilePlainPage />} />
        <Route path="/public-profile/profiles/modal" element={<ProfileModalPage />} />
        <Route path="/public-profile/projects/3-columns" element={<ProjectColumn3Page />} />
        <Route path="/public-profile/projects/2-columns" element={<ProjectColumn2Page />} />
        <Route path="/public-profile/works" element={<ProfileWorksPage />} />
        <Route path="/public-profile/teams" element={<ProfileTeamsPage />} />
        <Route path="/public-profile/network" element={<ProfileNetworkPage />} />
        <Route path="/public-profile/activity" element={<ProfileActivityPage />} />
        <Route path="/public-profile/campaigns/card" element={<CampaignsCardPage />} />
        <Route path="/public-profile/campaigns/list" element={<CampaignsListPage />} />
        <Route path="/public-profile/empty" element={<ProfileEmptyPage />} />
        <Route path="/account/home/get-started" element={<AccountGetStartedPage />} />
        <Route path="/account/home/user-profile" element={<AccountUserProfilePage />} />
        <Route path="/account/home/company-profile" element={<AccountCompanyProfilePage />} />
        <Route path="/account/home/settings-sidebar" element={<AccountSettingsSidebarPage />} />
        <Route
          path="/account/home/settings-enterprise"
          element={<AccountSettingsEnterprisePage />}
        />
        <Route path="/account/home/settings-plain" element={<AccountSettingsPlainPage />} />
        <Route path="/account/home/settings-modal" element={<AccountSettingsModalPage />} />
        <Route path="/account/billing/basic" element={<AccountBasicPage />} />
        <Route path="/account/billing/enterprise" element={<AccountEnterprisePage />} />
        <Route path="/account/billing/plans" element={<AccountPlansPage />} />
        <Route path="/account/billing/history" element={<AccountHistoryPage />} />
        <Route path="/account/security/get-started" element={<AccountSecurityGetStartedPage />} />
        <Route path="/account/security/overview" element={<AccountOverviewPage />} />
        <Route
          path="/account/security/allowed-ip-addresses"
          element={<AccountAllowedIPAddressesPage />}
        />
        <Route path="/account/security/privacy-settings" element={<AccountPrivacySettingsPage />} />
        <Route
          path="/account/security/device-management"
          element={<AccountDeviceManagementPage />}
        />
        <Route
          path="/account/security/backup-and-recovery"
          element={<AccountBackupAndRecoveryPage />}
        />
        <Route path="/account/security/current-sessions" element={<AccountCurrentSessionsPage />} />
        <Route path="/account/security/security-log" element={<AccountSecurityLogPage />} />
        <Route path="/account/members/team-starter" element={<AccountTeamsStarterPage />} />
        <Route path="/account/members/teams" element={<AccountTeamsPage />} />
        <Route path="/account/members/team-info" element={<AccountTeamInfoPage />} />
        <Route path="/account/members/member-starter" element={<AccountMembersStarterPage />} />
        <Route path="/account/members/team-members" element={<AccountTeamMembersPage />} />
        <Route path="/account/members/import-members" element={<AccountImportMembersPage />} />
        <Route path="/account/members/roles" element={<AccountRolesPage />} />
        <Route
          path="/account/members/permissions-toggle"
          element={<AccountPermissionsTogglePage />}
        />
        <Route
          path="/account/members/permissions-check"
          element={<AccountPermissionsCheckPage />}
        />
        <Route path="/account/integrations" element={<AccountIntegrationsPage />} />
        <Route path="/account/notifications" element={<AccountNotificationsPage />} />
        <Route path="/account/api-keys" element={<AccountApiKeysPage />} />
        <Route path="/account/appearance" element={<AccountAppearancePage />} />
        <Route path="/account/invite-a-friend" element={<AccountInviteAFriendPage />} />
        <Route path="/account/activity" element={<AccountActivityPage />} />
        <Route path="/network/get-started" element={<NetworkGetStartedPage />} />
        <Route path="/network/user-cards/mini-cards" element={<NetworkMiniCardsPage />} />
        <Route path="/network/user-cards/team-crew" element={<NetworkUserCardsTeamCrewPage />} />
        <Route path="/network/user-cards/author" element={<NetworkAuthorPage />} />
        <Route path="/network/user-cards/nft" element={<NetworkNFTPage />} />
        <Route path="/network/user-cards/social" element={<NetworkSocialPage />} />
        <Route path="/network/user-table/team-crew" element={<NetworkUserTableTeamCrewPage />} />
        <Route path="/network/user-table/app-roster" element={<NetworkAppRosterPage />} />
        <Route path="/network/user-table/market-authors" element={<NetworkMarketAuthorsPage />} />
        <Route path="/network/user-table/saas-users" element={<NetworkSaasUsersPage />} />
        <Route path="/network/user-table/store-clients" element={<NetworkStoreClientsPage />} />
        <Route path="/network/user-table/visitors" element={<NetworkVisitorsPage />} />
        <Route path="/auth/welcome-message" element={<AuthenticationWelcomeMessagePage />} />
        <Route
          path="/auth/account-deactivated"
          element={<AuthenticationAccountDeactivatedPage />}
        />
        <Route path="/authentication/get-started" element={<AuthenticationGetStartedPage />} />
      </Route>
      <Route path="error/*" element={<ErrorsRouting />} />
      <Route path="auth/*" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
};

export default AllRoutesSetting;

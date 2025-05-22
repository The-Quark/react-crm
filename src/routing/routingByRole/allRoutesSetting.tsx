import React from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { DefaultPage } from '@/pages/dashboards';
import { ProfilePage } from '@/pages/profile/profilePage.tsx';
import { PermissionPage, RolesListPage, RolesStarterPage } from '@/pages/roles-permissions';
import { UsersListPage, UsersPublicProfilePage, UsersStarterPage } from '@/pages/crm';
import {
  CompaniesListPage,
  CompaniesStarterPage,
  CompaniesViewPage,
  DepartmentsListPage,
  PositionsListPage,
  SubdivisionsListPage
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
import {
  ApplicationsListPage,
  ApplicationsStarterPage,
  OrdersStarterPage,
  OrdersListPage,
  CargoStarterPage,
  PackagesStarterPage,
  CargoListPage,
  PackagesListPage,
  PackagesUploadPage,
  CargoUploadPage
} from '@/pages/call-center';

import { Demo1Layout } from '@/layouts/demo1';
import { ErrorsRouting } from '@/errors';
import { AuthPage } from '@/auth';
import { ClientsListPage, ClientStarterPage } from '@/pages/clients';
import {
  GuidesCurrenciesPage,
  GuidesLanguagesPage,
  GuidesVehiclesPage,
  GuidesSourcesPage,
  GuidesPackageTypesPage,
  GuidesAirlinesPage,
  GuidesPackageMaterialsPage,
  GuidesCountriesPage,
  GuidesDeliveryTypesPage,
  GuidesAirlineRatesPage,
  GuidesTemplatesPage,
  GuidesUnitsPage
} from '@/pages/guides';
import { GuidesCitiesPage } from '@/pages/guides/tabs/cities/guidesCitiesPage.tsx';
import { TasksListPage, TasksStarterPage, TasksViewPage } from '@/pages/tasks';
import { DriversListPage, DriversStarterPage } from '@/pages/hr-module/drivers';
import { StaffListPage, StaffStarterPage } from '@/pages/hr-module/staff';
import { CouriersListPage, CouriersStarterPage } from '@/pages/hr-module';

const AllRoutesSetting = () => {
  return (
    <Routes>
      <Route element={<Demo1Layout />}>
        <Route path="/" element={<DefaultPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/global-parameters/starter-parameters" element={<CompaniesStarterPage />} />
        <Route
          path="/global-parameters/starter-parameters/:id"
          element={<CompaniesStarterPage />}
        />
        <Route path="/global-parameters/view-parameters/:id" element={<CompaniesViewPage />} />
        <Route path="/global-parameters/list" element={<CompaniesListPage />} />
        <Route path="/global-parameters/departments/list" element={<DepartmentsListPage />} />
        <Route path="/global-parameters/subdivisions/list" element={<SubdivisionsListPage />} />
        <Route path="/global-parameters/positions/list" element={<PositionsListPage />} />
        <Route path="/roles-permissions/roles/list" element={<RolesListPage />} />
        <Route path="/roles-permissions/roles/starter/:role" element={<RolesStarterPage />} />
        <Route path="/roles-permissions/permissions" element={<PermissionPage />} />
        <Route path="/tasks/list" element={<TasksListPage />} />
        <Route path="/tasks/starter" element={<TasksStarterPage />} />
        <Route path="/tasks/starter/:id" element={<TasksStarterPage />} />
        <Route path="/tasks/view/:id" element={<TasksViewPage />} />
        <Route path="/clients" element={<ClientsListPage />} />
        <Route path="/clients/starter-clients" element={<ClientStarterPage />} />
        <Route path="/clients/starter-clients/:id" element={<ClientStarterPage />} />
        <Route path="/hr-module/staff/list" element={<StaffListPage />} />
        <Route path="/hr-module/staff/starter" element={<StaffStarterPage />} />
        <Route path="/hr-module/staff/starter/:id" element={<StaffStarterPage />} />
        <Route path="/hr-module/drivers/list" element={<DriversListPage />} />
        <Route path="/hr-module/drivers/starter" element={<DriversStarterPage />} />
        <Route path="/hr-module/drivers/starter/:id" element={<DriversStarterPage />} />
        <Route path="/hr-module/couriers/list" element={<CouriersListPage />} />
        <Route path="/hr-module/couriers/starter" element={<CouriersStarterPage />} />
        <Route path="/hr-module/couriers/starter/:id" element={<CouriersStarterPage />} />
        <Route path="/call-center/applications/starter" element={<ApplicationsStarterPage />} />
        <Route path="/call-center/applications/starter/:id" element={<ApplicationsStarterPage />} />
        <Route path="/call-center/applications/list" element={<ApplicationsListPage />} />
        <Route path="/call-center/orders/starter" element={<OrdersStarterPage />} />
        <Route path="/call-center/orders/starter/:id" element={<OrdersStarterPage />} />
        <Route path="/call-center/orders/list" element={<OrdersListPage />} />
        <Route path="/call-center/packages/starter" element={<PackagesStarterPage />} />
        <Route path="/call-center/packages/starter/:id" element={<PackagesStarterPage />} />
        <Route path="/call-center/packages/upload/:id" element={<PackagesUploadPage />} />
        <Route path="/call-center/packages/list" element={<PackagesListPage />} />
        <Route path="/call-center/cargo/starter" element={<CargoStarterPage />} />
        <Route path="/call-center/cargo/starter/:id" element={<CargoStarterPage />} />
        <Route path="/call-center/cargo/upload/:id" element={<CargoUploadPage />} />
        <Route path="/call-center/cargo/list" element={<CargoListPage />} />
        <Route path="/crm/users/starter" element={<UsersStarterPage />} />
        <Route path="/crm/users/starter/:id" element={<UsersStarterPage />} />
        <Route path="/crm/users/list" element={<UsersListPage />} />,
        <Route path="/crm/users/public-profile/:id" element={<UsersPublicProfilePage />} />
        <Route path="/guides/currencies" element={<GuidesCurrenciesPage />} />
        <Route path="/guides/countries" element={<GuidesCountriesPage />} />
        <Route path="/guides/cities" element={<GuidesCitiesPage />} />
        <Route path="/guides/languages" element={<GuidesLanguagesPage />} />
        <Route path="/guides/sources" element={<GuidesSourcesPage />} />
        <Route path="/guides/vehicles" element={<GuidesVehiclesPage />} />
        <Route path="/guides/airlines" element={<GuidesAirlinesPage />} />
        <Route path="/guides/airline-rates" element={<GuidesAirlineRatesPage />} />
        <Route path="/guides/delivery-types" element={<GuidesDeliveryTypesPage />} />
        <Route path="/guides/package-types" element={<GuidesPackageTypesPage />} />
        <Route path="/guides/package-materials" element={<GuidesPackageMaterialsPage />} />
        <Route path="/guides/units" element={<GuidesUnitsPage />} />
        <Route path="/guides/templates" element={<GuidesTemplatesPage />} />
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

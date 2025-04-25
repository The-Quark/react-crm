import React from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { DefaultPage } from '@/pages/dashboards';
import { ProfilePage } from '@/pages/profile/profilePage.tsx';
import { GlobalParametersListPage, GlobalParameterViewPage } from '@/pages/global-parameters';
import { PermissionPage, RolesPage } from '@/pages/roles-permissions';
import StaffPage from '@/pages/hr-module/staff/staffPage.tsx';
import DriversPage from '@/pages/hr-module/drivers/driversPage.tsx';
import CouriersPage from '@/pages/hr-module/couriers/couriersPage.tsx';
import { MemberPublicProfilePage, MembersPage } from '@/pages/crm';
import { Demo1Layout } from '@/layouts/demo1';
import { ErrorsRouting } from '@/errors';
import { AuthPage } from '@/auth';
import { ClientsListPage } from '@/pages/clients';
import {
  GuidesCurrenciesPage,
  GuidesLanguagesPage,
  GuidesVehiclesPage,
  GuidesSourcesPage,
  GuidesPackageTypesPage,
  GuidesAirlinesPage,
  GuidesPackageMaterialsPage,
  GuidesCountriesPage
} from '@/pages/guides';
import { GuidesCitiesPage } from '@/pages/guides/tabs/cities/guidesCitiesPage.tsx';
import { ApplicationsListPage, ApplicationsStarterPage, OrdersPage } from '@/pages/call-center';

const ViewerRoutesSetting = () => {
  return (
    <Routes>
      <Route element={<Demo1Layout />}>
        <Route path="/" element={<DefaultPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/global-parameters/parameters" element={<GlobalParametersListPage />} />
        <Route
          path="/global-parameters/view-parameters/:id"
          element={<GlobalParameterViewPage />}
        />
        <Route path="/roles-permissions/roles" element={<RolesPage />} />
        <Route path="/roles-permissions/permissions" element={<PermissionPage />} />

        <Route path="/clients" element={<ClientsListPage />} />

        <Route path="/hr-module/staff" element={<StaffPage />} />
        <Route path="/hr-module/drivers" element={<DriversPage />} />
        <Route path="/hr-module/couriers" element={<CouriersPage />} />

        <Route path="/call-center/applications/starter" element={<ApplicationsStarterPage />} />
        <Route path="/call-center/applications/list" element={<ApplicationsListPage />} />
        <Route path="/call-center/orders" element={<OrdersPage />} />

        <Route path="/crm/members" element={<MembersPage />} />
        <Route path="/crm/member/profile/:id" element={<MemberPublicProfilePage />} />

        <Route path="/guides/currencies" element={<GuidesCurrenciesPage />} />
        <Route path="/guides/countries" element={<GuidesCountriesPage />} />
        <Route path="/guides/cities" element={<GuidesCitiesPage />} />
        <Route path="/guides/languages" element={<GuidesLanguagesPage />} />
        <Route path="/guides/sources" element={<GuidesSourcesPage />} />
        <Route path="/guides/vehicles" element={<GuidesVehiclesPage />} />
        <Route path="/guides/airlines" element={<GuidesAirlinesPage />} />
        <Route path="/guides/package-types" element={<GuidesPackageTypesPage />} />
        <Route path="/guides/package-materials" element={<GuidesPackageMaterialsPage />} />
      </Route>
      <Route path="error/*" element={<ErrorsRouting />} />
      <Route path="auth/*" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
};

export default ViewerRoutesSetting;

import React from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { DefaultPage } from '@/pages/dashboards';
import { ProfilePage } from '@/pages/profile/profilePage.tsx';
import {
  CompaniesListPage,
  CompaniesStarterPage,
  CompaniesViewPage,
  DepartmentsListPage,
  DepartmentsStaterPage,
  DepartmentsViewPage,
  PositionsListPage,
  PositionsStarterPage,
  PositionsViewPage,
  SubdivisionsListPage,
  SubdivisionsStarterPage,
  SubdivisionsViewPage
} from '@/pages/global-parameters';
import { PermissionPage, RolesPage } from '@/pages/roles-permissions';
import StaffPage from '@/pages/hr-module/staff/staffPage.tsx';
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
  GuidesCountriesPage,
  GuidesDeliveryTypesPage,
  GuidesAirlineRatesPage,
  GuidesTemplatesPage,
  GuidesUnitsPage
} from '@/pages/guides';
import { GuidesCitiesPage } from '@/pages/guides/tabs/cities/guidesCitiesPage.tsx';
import {
  ApplicationsListPage,
  OrdersListPage,
  CargoListPage,
  PackagesListPage
} from '@/pages/call-center';
import { TasksListPage, TasksViewPage } from '@/pages/tasks';
import { DriversListPage, DriversViewPage } from '@/pages/hr-module/drivers';

const ViewerRoutesSetting = () => {
  return (
    <Routes>
      <Route element={<Demo1Layout />}>
        <Route path="/" element={<DefaultPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/global-parameters/view-parameters/:id" element={<CompaniesViewPage />} />
        <Route path="/global-parameters/list" element={<CompaniesListPage />} />

        <Route path="/global-parameters/departments/view/:id" element={<DepartmentsViewPage />} />
        <Route path="/global-parameters/departments/list" element={<DepartmentsListPage />} />

        <Route path="/global-parameters/subdivisions/view/:id" element={<SubdivisionsViewPage />} />
        <Route path="/global-parameters/subdivisions/list" element={<SubdivisionsListPage />} />

        <Route path="/global-parameters/positions/view/:id" element={<PositionsViewPage />} />
        <Route path="/global-parameters/positions/list" element={<PositionsListPage />} />

        <Route path="/roles-permissions/roles" element={<RolesPage />} />
        <Route path="/roles-permissions/permissions" element={<PermissionPage />} />

        <Route path="/tasks/list" element={<TasksListPage />} />
        <Route path="/tasks/view/:id" element={<TasksViewPage />} />

        <Route path="/clients" element={<ClientsListPage />} />

        <Route path="/hr-module/staff" element={<StaffPage />} />
        <Route path="/hr-module/drivers/list" element={<DriversListPage />} />
        <Route path="/hr-module/drivers/view/:id" element={<DriversViewPage />} />
        <Route path="/hr-module/couriers" element={<CouriersPage />} />

        <Route path="/call-center/applications/list" element={<ApplicationsListPage />} />
        <Route path="/call-center/orders/list" element={<OrdersListPage />} />
        <Route path="/call-center/packages/list" element={<PackagesListPage />} />
        <Route path="/call-center/cargo/list" element={<CargoListPage />} />

        <Route path="/crm/members" element={<MembersPage />} />
        <Route path="/crm/member/profile/:id" element={<MemberPublicProfilePage />} />

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
      </Route>
      <Route path="error/*" element={<ErrorsRouting />} />
      <Route path="auth/*" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
};

export default ViewerRoutesSetting;

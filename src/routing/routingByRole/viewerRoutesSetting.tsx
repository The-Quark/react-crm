import React from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { DefaultPage } from '@/pages/dashboards';
import { ProfilePage } from '@/pages/profile/profilePage.tsx';
import {
  CompaniesListPage,
  CompaniesViewPage,
  DepartmentsListPage,
  PositionsListPage,
  SubdivisionsListPage
} from '@/pages/global-parameters';
import { RolesListPage } from '@/pages/roles-permissions';
import { UsersListPage, UsersPublicProfilePage } from '@/pages/crm';
import { Demo1Layout } from '@/layouts/demo1';
import { ErrorsRouting } from '@/errors';
import { AuthPage } from '@/auth';
import { ClientsListPage } from '@/pages/clients';
import {
  GuidesCurrenciesPage,
  GuidesLanguagesPage,
  GuidesSourcesPage,
  GuidesPackageTypesPage,
  GuidesAirlinesPage,
  GuidesPackageMaterialsPage,
  GuidesCountriesPage,
  GuidesDeliveryTypesPage,
  GuidesAirlineRatesPage,
  GuidesTemplatesPage,
  GuidesUnitsPage,
  GuidesFileTypesPage,
  GuidesBoxTypesPage,
  GuidesTariffPage,
  GuidesAirportsPage
} from '@/pages/guides';
import { GuidesCitiesPage } from '@/pages/guides/tabs/cities/guidesCitiesPage.tsx';
import { ApplicationsListPage, OrdersListPage } from '@/pages/call-center';
import { PackagesListPage, CargoListPage } from '@/pages/warehouse';
import { TasksListPage, TasksViewPage } from '@/pages/tasks';
import { StaffListPage } from '@/pages/hr-module/staff';
import { CouriersListPage } from '@/pages/hr-module';
import { AuditChangesPage } from '@/pages/audit-changes/auditChangesPage.tsx';
import { TrashPage } from '@/pages/trash/trashPage.tsx';
import { DraftsPage } from '@/pages/drafts/draftsPage.tsx';
import { VehiclesPage } from '@/pages/car-park';

const ViewerRoutesSetting = () => {
  return (
    <Routes>
      <Route element={<Demo1Layout />}>
        <Route path="/" element={<DefaultPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/global-parameters/view-parameters/:id" element={<CompaniesViewPage />} />
        <Route path="/global-parameters/list" element={<CompaniesListPage />} />
        <Route path="/global-parameters/departments/list" element={<DepartmentsListPage />} />
        <Route path="/global-parameters/subdivisions/list" element={<SubdivisionsListPage />} />
        <Route path="/global-parameters/positions/list" element={<PositionsListPage />} />
        <Route path="/roles-permissions/roles/list" element={<RolesListPage />} />
        <Route path="/tasks/list" element={<TasksListPage />} />
        <Route path="/tasks/view/:id" element={<TasksViewPage />} />
        <Route path="/clients" element={<ClientsListPage />} />
        <Route path="/clients/:id" element={<ClientsListPage />} />
        <Route path="/hr-module/staff/list" element={<StaffListPage />} />
        <Route path="/hr-module/couriers/list" element={<CouriersListPage />} />
        <Route path="trash" element={<TrashPage />} />
        <Route path="drafts" element={<DraftsPage />} />
        <Route path="/audit-changes/:entity_type/:entity_id" element={<AuditChangesPage />} />
        <Route path="/call-center/applications/list" element={<ApplicationsListPage />} />
        <Route path="/call-center/applications/list/:id" element={<ApplicationsListPage />} />
        <Route path="/call-center/orders/list" element={<OrdersListPage />} />
        <Route path="/call-center/orders/list/:id" element={<OrdersListPage />} />
        <Route path="/warehouse/packages/list" element={<PackagesListPage />} />
        <Route path="/warehouse/packages/list/:id" element={<PackagesListPage />} />
        <Route path="/warehouse/cargo/list" element={<CargoListPage />} />
        <Route path="/warehouse/cargo/list/:id" element={<CargoListPage />} />
        <Route path="/crm/users/list" element={<UsersListPage />} />
        <Route path="/crm/users/public-profile/:id" element={<UsersPublicProfilePage />} />
        <Route path="/car-park/vehicles" element={<VehiclesPage />} />
        <Route path="/guides/currencies" element={<GuidesCurrenciesPage />} />
        <Route path="/guides/countries" element={<GuidesCountriesPage />} />
        <Route path="/guides/cities" element={<GuidesCitiesPage />} />
        <Route path="/guides/languages" element={<GuidesLanguagesPage />} />
        <Route path="/guides/sources" element={<GuidesSourcesPage />} />
        <Route path="/guides/tariffs" element={<GuidesTariffPage />} />
        <Route path="/guides/airlines" element={<GuidesAirlinesPage />} />
        <Route path="/guides/airports" element={<GuidesAirportsPage />} />
        <Route path="/guides/airline-rates" element={<GuidesAirlineRatesPage />} />
        <Route path="/guides/delivery-types" element={<GuidesDeliveryTypesPage />} />
        <Route path="/guides/package-types" element={<GuidesPackageTypesPage />} />
        <Route path="/guides/package-materials" element={<GuidesPackageMaterialsPage />} />
        <Route path="/guides/units" element={<GuidesUnitsPage />} />
        <Route path="/guides/templates" element={<GuidesTemplatesPage />} />
        <Route path="/guides/file-types" element={<GuidesFileTypesPage />} />
        <Route path="/guides/box-types" element={<GuidesBoxTypesPage />} />
      </Route>
      <Route path="error/*" element={<ErrorsRouting />} />
      <Route path="auth/*" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
};

export default ViewerRoutesSetting;

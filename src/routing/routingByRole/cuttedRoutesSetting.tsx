import React, { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { DefaultPage } from '@/pages/dashboards';
import { ProfilePage } from '@/pages/profile/profilePage.tsx';
import {
  CompaniesListPage,
  CompaniesStarterPage,
  CompaniesViewPage,
  DepartmentsListPage,
  PositionsListPage,
  SubdivisionsListPage
} from '@/pages/global-parameters';
import { Demo1Layout } from '@/layouts/demo1';
import { ErrorsRouting } from '@/errors';
import { AuthPage } from '@/auth';
import {
  UsersListPage,
  UsersPermissionsStarter,
  UsersPublicProfilePage,
  UsersStarterPage
} from '@/pages/crm';
import { ClientsListPage, ClientStarterPage } from '@/pages/clients';
import {
  GuidesAirlineRatesPage,
  GuidesAirlinesPage,
  GuidesBoxTypesPage,
  GuidesCountriesPage,
  GuidesCurrenciesPage,
  GuidesDeliveryTypesPage,
  GuidesFileTypesPage,
  GuidesLanguagesPage,
  GuidesPackageMaterialsPage,
  GuidesPackageTypesPage,
  GuidesSourcesPage,
  GuidesTariffPage,
  GuidesTemplatesPage,
  GuidesUnitsPage,
  GuidesVehiclesPage
} from '@/pages/guides';
import { GuidesCitiesPage } from '@/pages/guides/tabs/cities/guidesCitiesPage.tsx';
import {
  ApplicationsListPage,
  ApplicationsStarterPage,
  FastFormStarterPage,
  MyDraftsPage,
  OrdersListPage,
  OrdersStarterPage
} from '@/pages/call-center';
import {
  PackagesListPage,
  PackagesStarterPage,
  CargoStarterPage,
  CargoListPage,
  PackagesUploadPage,
  CargoUploadPage
} from '@/pages/warehouse';
import { TasksListPage, TasksStarterPage, TasksViewPage } from '@/pages/tasks';
import {
  CouriersListPage,
  CouriersStarterPage,
  DriversListPage,
  DriversStarterPage,
  StaffListPage,
  StaffStarterPage
} from '@/pages/hr-module';
import { RolesListPage, RolesStarterPage } from '@/pages/roles-permissions';

interface Props {
  permissions: string[];
}
const routeConfig = [
  {
    permission: 'manage global settings',
    routes: [
      { path: '/global-parameters/list', element: <CompaniesListPage /> },
      { path: '/global-parameters/starter-parameters', element: <CompaniesStarterPage /> },
      {
        path: '/global-parameters/starter-parameters/:id',
        element: <CompaniesStarterPage />
      },
      { path: '/global-parameters/view-parameters/:id', element: <CompaniesViewPage /> },

      { path: '/global-parameters/departments/list', element: <DepartmentsListPage /> },

      { path: '/global-parameters/subdivisions/list', element: <SubdivisionsListPage /> },

      { path: '/global-parameters/positions/list', element: <PositionsListPage /> },

      { path: '/guides/currencies', element: <GuidesCurrenciesPage /> },
      { path: '/guides/countries', element: <GuidesCountriesPage /> },
      { path: '/guides/cities', element: <GuidesCitiesPage /> },
      { path: '/guides/languages', element: <GuidesLanguagesPage /> },
      { path: '/guides/sources', element: <GuidesSourcesPage /> },
      { path: '/guides/vehicles', element: <GuidesVehiclesPage /> },
      { path: '/guides/tariffs', element: <GuidesTariffPage /> },
      { path: '/guides/airlines', element: <GuidesAirlinesPage /> },
      { path: '/guides/airline-rates', element: <GuidesAirlineRatesPage /> },
      { path: '/guides/delivery-types', element: <GuidesDeliveryTypesPage /> },
      { path: '/guides/package-types', element: <GuidesPackageTypesPage /> },
      { path: '/guides/package-materials', element: <GuidesPackageMaterialsPage /> },
      { path: '/guides/units', element: <GuidesUnitsPage /> },
      { path: '/guides/templates', element: <GuidesTemplatesPage /> },
      { path: '/guides/file-types', element: <GuidesFileTypesPage /> },
      { path: '/guides/box-types', element: <GuidesBoxTypesPage /> }
    ]
  },
  {
    permission: 'view global settings',
    routes: [
      { path: '/global-parameters/list', element: <CompaniesListPage /> },
      { path: '/global-parameters/view-parameters/:id', element: <CompaniesViewPage /> },
      { path: '/global-parameters/departments/list', element: <DepartmentsListPage /> },
      { path: '/global-parameters/subdivisions/list', element: <SubdivisionsListPage /> },
      { path: '/global-parameters/positions/list', element: <PositionsListPage /> },
      { path: '/guides/currencies', element: <GuidesCurrenciesPage /> },
      { path: '/guides/countries', element: <GuidesCountriesPage /> },
      { path: '/guides/cities', element: <GuidesCitiesPage /> },
      { path: '/guides/languages', element: <GuidesLanguagesPage /> },
      { path: '/guides/tariffs', element: <GuidesTariffPage /> },
      { path: '/guides/sources', element: <GuidesSourcesPage /> },
      { path: '/guides/vehicles', element: <GuidesVehiclesPage /> },
      { path: '/guides/packages', element: <GuidesPackageTypesPage /> },
      { path: '/guides/airlines', element: <GuidesAirlinesPage /> },
      { path: '/guides/airline-rates', element: <GuidesAirlineRatesPage /> },
      { path: '/guides/delivery-types', element: <GuidesDeliveryTypesPage /> },
      { path: '/guides/package-types', element: <GuidesPackageTypesPage /> },
      { path: '/guides/package-materials', element: <GuidesPackageMaterialsPage /> },
      { path: '/guides/units', element: <GuidesUnitsPage /> },
      { path: '/guides/templates', element: <GuidesTemplatesPage /> },
      { path: '/guides/file-types', element: <GuidesFileTypesPage /> },
      { path: '/guides/box-types', element: <GuidesBoxTypesPage /> }
    ]
  },
  {
    permission: 'manage global contexted settings',
    routes: [
      {
        path: '/global-parameters/starter-parameters/:id',
        element: <CompaniesStarterPage />
      },
      { path: '/global-parameters/view-parameters/:id', element: <CompaniesViewPage /> }
    ]
  },
  {
    permission: 'view global contexted settings',
    routes: [{ path: '/global-parameters/view-parameters/:id', element: <CompaniesViewPage /> }]
  },
  {
    permission: 'manage users',
    routes: [
      { path: '/crm/users/starter', element: <UsersStarterPage /> },
      { path: '/crm/users/starter/:id', element: <UsersStarterPage /> },
      { path: '/crm/users/list', element: <UsersListPage /> },
      { path: '/crm/users/public-profile/:id', element: <UsersPublicProfilePage /> },
      { path: '/crm/users/users-permissions/:id', element: <UsersPermissionsStarter /> },
      { path: '/hr-module/staff/list', element: <StaffListPage /> },
      { path: '/hr-module/staff/starter', element: <StaffStarterPage /> },
      { path: '/hr-module/staff/starter/:id', element: <StaffStarterPage /> },
      { path: '/hr-module/drivers/list', element: <DriversListPage /> },
      { path: '/hr-module/drivers/starter', element: <DriversStarterPage /> },
      { path: '/hr-module/drivers/starter/:id', element: <DriversStarterPage /> },
      { path: '/hr-module/couriers/list', element: <CouriersListPage /> },
      { path: '/hr-module/couriers/starter', element: <CouriersStarterPage /> },
      { path: '/hr-module/couriers/starter/:id', element: <CouriersStarterPage /> }
    ]
  },
  {
    permission: 'view users',
    routes: [
      { path: '/crm/users/list', element: <UsersListPage /> },
      { path: '/crm/users/public-profile/:id', element: <UsersPublicProfilePage /> },
      { path: '/hr-module/staff/list', element: <StaffListPage /> },
      { path: '/hr-module/drivers/list', element: <DriversListPage /> },
      { path: '/hr-module/couriers/list', element: <CouriersListPage /> }
    ]
  },
  {
    permission: 'manage roles',
    routes: [
      { path: '/roles-permissions/roles/list', element: <RolesListPage /> },
      { path: '/roles-permissions/roles/starter/:role', element: <RolesStarterPage /> }
    ]
  },
  {
    permission: 'view roles',
    routes: [{ path: '/roles-permissions/roles/list', element: <RolesListPage /> }]
  },
  {
    permission: 'manage tasks',
    routes: [
      { path: '/tasks/starter', element: <TasksStarterPage /> },
      { path: '/tasks/list', element: <TasksListPage /> },
      { path: '/tasks/starter/:id', element: <TasksStarterPage /> },
      { path: '/tasks/view/:id', element: <TasksViewPage /> }
    ]
  },
  {
    permission: 'view tasks',
    routes: [
      { path: '/tasks/list', element: <TasksListPage /> },
      { path: '/tasks/view/:id', element: <TasksViewPage /> }
    ]
  },
  {
    permission: 'manage clients',
    routes: [
      { path: '/clients/starter-clients', element: <ClientStarterPage /> },
      { path: '/clients', element: <ClientsListPage /> },
      { path: '/clients/starter-clients/:id', element: <ClientStarterPage /> }
    ]
  },
  {
    permission: 'view clients',
    routes: [{ path: '/clients', element: <ClientsListPage /> }]
  },
  {
    permission: 'manage applications',
    routes: [
      { path: '/call-center/applications/starter', element: <ApplicationsStarterPage /> },
      { path: '/call-center/applications/starter/:id', element: <ApplicationsStarterPage /> },
      { path: '/call-center/applications/list', element: <ApplicationsListPage /> }
    ]
  },
  {
    permission: 'view applications',
    routes: [{ path: '/call-center/applications/list', element: <ApplicationsListPage /> }]
  },
  {
    permission: 'manage orders',
    routes: [
      { path: '/call-center/orders/starter', element: <OrdersStarterPage /> },
      {
        path: '/call-center/orders/starter/:id',
        element: <OrdersStarterPage />
      },
      { path: '/call-center/orders/list', element: <OrdersListPage /> },
      { path: '/call-center/my-drafts', element: <MyDraftsPage /> },
      { path: '/call-center/fast-form/starter', element: <FastFormStarterPage /> },
      { path: '/warehouse/packages/starter', element: <PackagesStarterPage /> },
      {
        path: '/warehouse/packages/starter/:id',
        element: <PackagesStarterPage />
      },
      {
        path: '/warehouse/packages/upload/:id',
        element: <PackagesUploadPage />
      },
      { path: '/warehouse/packages/list/:id', element: <PackagesListPage /> },
      { path: '/warehouse/packages/list', element: <PackagesListPage /> },
      { path: '/warehouse/cargo/starter', element: <CargoStarterPage /> },
      {
        path: '/warehouse/cargo/starter/:id',
        element: <CargoStarterPage />
      },
      {
        path: '/warehouse/cargo/upload/:id',
        element: <CargoUploadPage />
      },
      { path: '/warehouse/cargo/list/:id', element: <CargoListPage /> },
      { path: '/warehouse/cargo/list', element: <CargoListPage /> }
    ]
  },
  {
    permission: 'view orders',
    routes: [
      { path: '/call-center/orders/list', element: <OrdersListPage /> },
      { path: '/warehouse/packages/list/:id', element: <PackagesListPage /> },
      { path: '/warehouse/packages/list', element: <PackagesListPage /> },
      { path: '/warehouse/cargo/list/:id', element: <CargoListPage /> },
      { path: '/warehouse/cargo/list', element: <CargoListPage /> }
    ]
  }
];

const CuttedRoutesSetting: FC<Props> = ({ permissions }) => {
  const hasPermission = (perm: string) =>
    permissions.includes(perm) || permissions.includes('everything');
  return (
    <Routes>
      <Route element={<Demo1Layout />}>
        <Route path="/" element={<DefaultPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        {routeConfig.map(({ permission, routes }) =>
          hasPermission(permission)
            ? routes.map(({ path, element }) => <Route key={path} path={path} element={element} />)
            : null
        )}
      </Route>
      <Route path="error/*" element={<ErrorsRouting />} />
      <Route path="auth/*" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
};

export default CuttedRoutesSetting;

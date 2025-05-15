import React, { FC } from 'react';
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
import { Demo1Layout } from '@/layouts/demo1';
import { ErrorsRouting } from '@/errors';
import { AuthPage } from '@/auth';
import {
  MemberPublicProfilePage,
  MemberRoleUpdatePage,
  MembersPage,
  MemberStarterPage,
  MemberUpdatePage
} from '@/pages/crm';
import { ClientsListPage, ClientStarterPage } from '@/pages/clients';
import {
  GuidesAirlineRatesPage,
  GuidesAirlinesPage,
  GuidesCountriesPage,
  GuidesCurrenciesPage,
  GuidesDeliveryTypesPage,
  GuidesLanguagesPage,
  GuidesPackageMaterialsPage,
  GuidesPackageTypesPage,
  GuidesSourcesPage,
  GuidesTemplatesPage,
  GuidesUnitsPage,
  GuidesVehiclesPage
} from '@/pages/guides';
import { GuidesCitiesPage } from '@/pages/guides/tabs/cities/guidesCitiesPage.tsx';
import {
  ApplicationsListPage,
  ApplicationsStarterPage,
  OrdersListPage,
  OrdersStarterPage,
  PackagesListPage,
  PackagesStarterPage,
  CargoStarterPage,
  CargoListPage,
  PackagesUploadPage,
  CargoUploadPage
} from '@/pages/call-center';
import { TasksListPage, TasksStarterPage, TasksViewPage } from '@/pages/tasks';

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
      { path: '/global-parameters/departments/starter', element: <DepartmentsStaterPage /> },
      {
        path: '/global-parameters/departments/starter/:id',
        element: <DepartmentsStaterPage />
      },
      { path: '/global-parameters/departments/view/:id', element: <DepartmentsViewPage /> },

      { path: '/global-parameters/subdivisions/list', element: <SubdivisionsListPage /> },
      { path: '/global-parameters/subdivisions/starter', element: <SubdivisionsStarterPage /> },
      {
        path: '/global-parameters/subdivisions/starter/:id',
        element: <SubdivisionsStarterPage />
      },
      { path: '/global-parameters/subdivisions/view/:id', element: <SubdivisionsViewPage /> },

      { path: '/global-parameters/positions/list', element: <PositionsListPage /> },
      { path: '/global-parameters/positions/starter', element: <PositionsStarterPage /> },
      {
        path: '/global-parameters/positions/starter/:id',
        element: <PositionsStarterPage />
      },
      { path: '/global-parameters/positions/view/:id', element: <PositionsViewPage /> },

      { path: '/guides/currencies', element: <GuidesCurrenciesPage /> },
      { path: '/guides/countries', element: <GuidesCountriesPage /> },
      { path: '/guides/cities', element: <GuidesCitiesPage /> },
      { path: '/guides/languages', element: <GuidesLanguagesPage /> },
      { path: '/guides/sources', element: <GuidesSourcesPage /> },
      { path: '/guides/vehicles', element: <GuidesVehiclesPage /> },
      { path: '/guides/airlines', element: <GuidesAirlinesPage /> },
      { path: '/guides/airlines', element: <GuidesAirlineRatesPage /> },
      { path: '/guides/delivery-types', element: <GuidesDeliveryTypesPage /> },
      { path: '/guides/package-types', element: <GuidesPackageTypesPage /> },
      { path: '/guides/package-materials', element: <GuidesPackageMaterialsPage /> },
      { path: '/guides/units', element: <GuidesUnitsPage /> },
      { path: '/guides/templates', element: <GuidesTemplatesPage /> }
    ]
  },
  {
    permission: 'view global settings',
    routes: [
      { path: '/global-parameters/list', element: <CompaniesListPage /> },
      { path: '/global-parameters/view-parameters/:id', element: <CompaniesViewPage /> },
      { path: '/global-parameters/departments/list', element: <DepartmentsListPage /> },
      { path: '/global-parameters/departments/view/:id', element: <DepartmentsViewPage /> },
      { path: '/global-parameters/subdivisions/list', element: <SubdivisionsListPage /> },
      { path: '/global-parameters/subdivisions/view/:id', element: <SubdivisionsViewPage /> },
      { path: '/global-parameters/positions/list', element: <PositionsListPage /> },
      { path: '/global-parameters/positions/view/:id', element: <PositionsViewPage /> },
      { path: '/guides/currencies', element: <GuidesCurrenciesPage /> },
      { path: '/guides/countries', element: <GuidesCountriesPage /> },
      { path: '/guides/cities', element: <GuidesCitiesPage /> },
      { path: '/guides/languages', element: <GuidesLanguagesPage /> },
      { path: '/guides/sources', element: <GuidesSourcesPage /> },
      { path: '/guides/vehicles', element: <GuidesVehiclesPage /> },
      { path: '/guides/packages', element: <GuidesPackageTypesPage /> },
      { path: '/guides/airlines', element: <GuidesAirlinesPage /> },
      { path: '/guides/airlines', element: <GuidesAirlineRatesPage /> },
      { path: '/guides/delivery-types', element: <GuidesDeliveryTypesPage /> },
      { path: '/guides/package-types', element: <GuidesPackageTypesPage /> },
      { path: '/guides/package-materials', element: <GuidesPackageMaterialsPage /> },
      { path: '/guides/units', element: <GuidesUnitsPage /> },
      { path: '/guides/templates', element: <GuidesTemplatesPage /> }
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
      { path: '/crm/member-starter', element: <MemberStarterPage /> },
      { path: '/crm/member-role-update/:id', element: <MemberRoleUpdatePage /> },
      { path: '/crm/member-update/:id', element: <MemberUpdatePage /> },
      { path: '/crm/members', element: <MembersPage /> },
      { path: '/crm/member/profile/:id', element: <MemberPublicProfilePage /> }
    ]
  },
  {
    permission: 'view users',
    routes: [
      { path: '/crm/members', element: <MembersPage /> },
      { path: '/crm/member/profile/:id', element: <MemberPublicProfilePage /> }
    ]
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
      { path: '/call-center/packages/starter', element: <PackagesStarterPage /> },
      {
        path: '/call-center/packages/starter/:id',
        element: <PackagesStarterPage />
      },
      {
        path: '/call-center/packages/upload/:id',
        element: <PackagesUploadPage />
      },
      { path: '/call-center/packages/list', element: <PackagesListPage /> },
      { path: '/call-center/cargo/starter', element: <CargoStarterPage /> },
      {
        path: '/call-center/cargo/starter/:id',
        element: <CargoStarterPage />
      },
      {
        path: '/call-center/cargo/upload/:id',
        element: <CargoUploadPage />
      },
      { path: '/call-center/cargo/list', element: <CargoListPage /> }
    ]
  },
  {
    permission: 'view orders',
    routes: [
      { path: '/call-center/orders/list', element: <OrdersListPage /> },
      { path: '/call-center/packages/list', element: <PackagesListPage /> },
      { path: '/call-center/cargo/list', element: <CargoListPage /> }
    ]
  }
];

const CuttedRoutesSetting: FC<Props> = ({ permissions }) => {
  const hasPermission = (perm: string) =>
    permissions.includes(perm) || permissions.includes('everything');
  console.log('CuttedRoutesSetting');
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

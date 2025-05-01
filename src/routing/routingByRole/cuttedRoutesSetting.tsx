import React, { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { DefaultPage } from '@/pages/dashboards';
import { ProfilePage } from '@/pages/profile/profilePage.tsx';
import {
  GlobalParametersListPage,
  GlobalParameterStarterPage,
  GlobalParameterViewPage
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
import { ClientsListPage, ClientStarterPage, ClientUpdatePage } from '@/pages/clients';
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
  GuidesVehiclesPage
} from '@/pages/guides';
import { GuidesCitiesPage } from '@/pages/guides/tabs/cities/guidesCitiesPage.tsx';
import {
  ApplicationsListPage,
  ApplicationsStarterPage,
  OrdersListPage,
  OrdersStarterPage
} from '@/pages/call-center';

interface Props {
  permissions: string[];
}
const routeConfig = [
  {
    permission: 'manage global settings',
    routes: [
      { path: '/global-parameters/list', element: <GlobalParametersListPage /> },
      { path: '/global-parameters/starter-parameters', element: <GlobalParameterStarterPage /> },
      {
        path: '/global-parameters/starter-parameters/:id',
        element: <GlobalParameterStarterPage />
      },
      { path: '/global-parameters/view-parameters/:id', element: <GlobalParameterViewPage /> },
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
      { path: '/guides/package-materials', element: <GuidesPackageMaterialsPage /> }
    ]
  },
  {
    permission: 'view global settings',
    routes: [
      { path: '/global-parameters/list', element: <GlobalParametersListPage /> },
      { path: '/global-parameters/view-parameters/:id', element: <GlobalParameterViewPage /> },
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
      { path: '/guides/package-materials', element: <GuidesPackageMaterialsPage /> }
    ]
  },
  {
    permission: 'manage global contexted settings',
    routes: [
      {
        path: '/global-parameters/starter-parameters/:id',
        element: <GlobalParameterStarterPage />
      },
      { path: '/global-parameters/view-parameters/:id', element: <GlobalParameterViewPage /> }
    ]
  },
  {
    permission: 'view global contexted settings',
    routes: [
      { path: '/global-parameters/view-parameters/:id', element: <GlobalParameterViewPage /> }
    ]
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
    permission: 'manage clients',
    routes: [
      { path: '/clients/starter-clients', element: <ClientStarterPage /> },
      { path: '/clients', element: <ClientsListPage /> },
      { path: '/clients/client-update/:id', element: <ClientUpdatePage /> }
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
        path: '/call-center/orders/starter/:senderId?/:receiverId?/:applicationId?',
        element: <OrdersStarterPage />
      },
      { path: '/call-center/orders/list', element: <OrdersListPage /> }
    ]
  },
  {
    permission: 'view orders',
    routes: [{ path: '/call-center/orders/list', element: <OrdersListPage /> }]
  }
];

const CuttedRoutesSetting: FC<Props> = ({ permissions }) => {
  const hasPermission = (perm: string) =>
    permissions.includes(perm) || permissions.includes('everything');
  console.log(permissions);
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

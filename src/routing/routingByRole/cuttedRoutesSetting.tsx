import React, { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { DefaultPage } from '@/pages/dashboards';
import { ProfilePage } from '@/pages/profile/profilePage.tsx';
import {
  GlobalParametersListPage,
  GlobalParameterStarterPage,
  GlobalParameterUpdatePage,
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
  GuidesCurrenciesPage,
  GuidesLanguagesPage,
  GuidesPackagesPage,
  GuidesSourcesPage,
  GuidesVehiclesPage
} from '@/pages/guides';

interface Props {
  permissions: string[];
}
const routeConfig = [
  {
    permission: 'manage global settings',
    routes: [
      { path: '/global-parameters/parameters', element: <GlobalParametersListPage /> },
      { path: '/global-parameters/starter-parameters', element: <GlobalParameterStarterPage /> },
      { path: '/global-parameters/update-parameters/:id', element: <GlobalParameterUpdatePage /> },
      { path: '/global-parameters/view-parameters/:id', element: <GlobalParameterViewPage /> },
      { path: '/guides/currencies', element: <GuidesCurrenciesPage /> },
      { path: '/guides/languages', element: <GuidesLanguagesPage /> },
      { path: '/guides/sources', element: <GuidesSourcesPage /> },
      { path: '/guides/vehicles', element: <GuidesVehiclesPage /> },
      { path: '/guides/packages', element: <GuidesPackagesPage /> }
    ]
  },
  {
    permission: 'view global settings',
    routes: [
      { path: '/global-parameters/parameters', element: <GlobalParametersListPage /> },
      { path: '/global-parameters/view-parameters/:id', element: <GlobalParameterViewPage /> },
      { path: '/guides/currencies', element: <GuidesCurrenciesPage /> },
      { path: '/guides/languages', element: <GuidesLanguagesPage /> },
      { path: '/guides/sources', element: <GuidesSourcesPage /> },
      { path: '/guides/vehicles', element: <GuidesVehiclesPage /> },
      { path: '/guides/packages', element: <GuidesPackagesPage /> }
    ]
  },
  {
    permission: 'manage global contexted settings',
    routes: [
      { path: '/global-parameters/update-parameters/:id', element: <GlobalParameterUpdatePage /> },
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

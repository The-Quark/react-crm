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
      { path: '/global-parameters/view-parameters/:id', element: <GlobalParameterViewPage /> }
    ]
  },
  {
    permission: 'view global settings',
    routes: [
      { path: '/global-parameters/view-parameters/:id', element: <GlobalParameterViewPage /> }
    ]
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

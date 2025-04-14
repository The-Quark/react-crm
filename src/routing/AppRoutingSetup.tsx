import React, { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { AuthPage, useAuthContext } from '@/auth';
import { RequireAuth } from '@/auth/RequireAuth';
import { ErrorsRouting } from '@/errors';
import { useCurrentUser } from '@/api';
import { ScreenLoader } from '@/components';
import AllRoutesSetting from '@/routing/routingByRole/allRoutesSetting.tsx';
import ViewerRoutesSetting from '@/routing/routingByRole/viewerRoutesSetting.tsx';
import CuttedRoutesSetting from '@/routing/routingByRole/cuttedRoutesSetting.tsx';

const AppRoutingSetup = (): ReactElement => {
  const { isLoading, data: currentUser } = useCurrentUser();
  const { auth } = useAuthContext();
  if (isLoading) {
    return <ScreenLoader />;
  }
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        {!auth && <Route path="/*" element={<ErrorsRouting />} />}
        {!isLoading && currentUser && currentUser.roles[0].name === 'superadmin' && (
          <Route path="/*" element={<AllRoutesSetting />} />
        )}
        {!isLoading && currentUser && currentUser.roles[0].name === 'viewer' && (
          <Route path="/*" element={<ViewerRoutesSetting />} />
        )}
        {!isLoading &&
          currentUser &&
          !['superadmin', 'viewer'].includes(currentUser.roles[0].name) && (
            <Route
              path="/*"
              element={
                <CuttedRoutesSetting permissions={currentUser.permissions.map((p) => p.name)} />
              }
            />
          )}
      </Route>
      <Route path="error/*" element={<ErrorsRouting />} />
      <Route path="auth/*" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
};

export { AppRoutingSetup };
